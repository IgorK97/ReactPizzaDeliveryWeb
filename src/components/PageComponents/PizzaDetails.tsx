import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PizzaContext } from "../../contexts/PizzaContext"
import { Pizza } from "../../models/pizza"
import { NewPizza } from "../../models/NewPizza"
import { Button, Checkbox, FormControlLabel, TextareaAutosize, TextField } from "@mui/material"
import IngredientSelection from "./IngredientSelection"
import IngredientNames from "./IngredientNames"
import pizzaService from "../../services/PizzaService"
import { IMAGE_BASE_URL } from "../../pathUtils/imagePath"

/**
 * Компонент для отображения и редактирования конкретной пиццы
 */
const PizzaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>() //Получаем ID пиццы из параметров URL
  const context = useContext(PizzaContext) //Доступ к контексту пицц
  const navigate = useNavigate() //Для перехода между страницами
const [imageName, setImageName]=useState<string>("");
  const [pizza, setPizza] = useState<Pizza | null>(null) //Храним текущую пиццу
const [editMode, setEditMode]=useState<boolean>(false)
const [updatedPizza, setUpdatedPizza]=useState<Pizza|null>(null)
const [imageFile,setImageFile]=useState<string|null>(null)
const [error, setError]=useState<string|null>(null);
  useEffect(() => {
    if (context) {
      const foundPizza = context.pizzas.find((piz) => piz.id === parseInt(id || "", 10));
      if(foundPizza){
        setPizza(foundPizza);
        setUpdatedPizza(foundPizza);
        const numbers = foundPizza.ingredients.map(ingredient => ingredient.id);
        // console.log(numbers);
        context.setSelectedIngredientIds(numbers);
      }
      else
      setError("Ошибка! Такой пиццы нет");
      // return (<div>Ошибка! Такой пиццы нет</div>)
    }
  }, [])

  if (!pizza || !updatedPizza ||!context) {
    return <div>Пицца не найдена!</div> 
  }
  if(error){
    return <div>{error}</div>
  }
  const {setPizzas, pizzas}=context;

  /**
   * Обновление пиццы, используя сервис pizzaService
   * @param id - идентификатор пиццы
   * @param updatedPizza - обнолвяемая пиццы
   */
const updatePizza = async (id: number, updatedPizza: NewPizza) => {
  const updatedPiz = await pizzaService.updatePizza(id, updatedPizza);

  setPizzas(pizzas.map((piz) => (piz.id === id ? updatedPiz : piz)))
return updatedPiz;

}

/**
 * обработчик отмены обновления
 */
const handleCancel=()=>{
  
  setEditMode(false);
  setUpdatedPizza(pizza);
  setImageFile(null);
  context?.setSelectedIngredientIds([]);
  // navigate("/pizzas");
}
const handleSave=async ()=>{
  if(!context||!updatedPizza) return;
const pizzaToSave:NewPizza={
  name:updatedPizza.name,
  description:updatedPizza.description,
  isAvailable:updatedPizza.isAvailable,
  image:imageFile,
  defaultIngredientIds:context.selectedIngredientIds
}
context?.setSelectedIngredientIds([]);
const foundPizza = await updatePizza(updatedPizza.id,pizzaToSave);

setEditMode(false);
// const foundPizza = context.pizzas.find((piz) => piz.id === updatedPizza.id);
// console.log(context.pizzas);
if(foundPizza)
  {
    setPizza(foundPizza);
    setUpdatedPizza(foundPizza);
        const numbers = foundPizza.ingredients.map(ingredient => ingredient.id);
        // console.log(numbers);
        context.setSelectedIngredientIds(numbers);
  }
}
return (
  <div>
    <h2>Пицца</h2>
    {editMode?(
      <div>
        <div><p>Название:</p>
        
        <TextField
                      value={updatedPizza.name}
                      onChange={(e)=>{
                        setUpdatedPizza({...updatedPizza, name:e.target.value})
                      }}
                     
                      required
                      name="name" />

             </div>
        <div>
        <p>Описание:</p>
        <TextareaAutosize
          placeholder="Описание"

          value={updatedPizza.description}
          required 
          onChange={(e)=>{
            setUpdatedPizza({...updatedPizza, description:e.target.value})
        
                  }}
          name="description"
        />
        <IngredientNames names={updatedPizza.ingredients.map(ingr => ingr.name)}/>
      </div>

<div>
  <FormControlLabel
              control={
                <Checkbox checked={updatedPizza.isAvailable} onChange={()=>{
                  setUpdatedPizza({...updatedPizza, isAvailable: !updatedPizza.isAvailable})
                
                                }} />
              }
              label={updatedPizza.isAvailable? "Пицца уже в ассортименте":"Пицца временно отсутствует"}
            />

    </div>
    <div>
    <p>Изображение в базе данных: </p>
    {pizza.image&&<img src={`${IMAGE_BASE_URL}${pizza.image}`}alt={pizza.image} width="450px"/>}
          <FormControlLabel control={ 
            <Button
      variant="contained"
      component="label"
      sx={{marginRight:"5px"}}
    >
      Загрузить изображение
    <input hidden type="file" accept="image/png" onChange={(e)=>{
      if(e.target.files&&e.target.files.length>0){
        setImageName(e.target.files[0].name);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
    reader.onload=()=>{
      setImageFile(reader.result as string);
    
    }

      }
    }}/>
           
    </Button>
             }
             label={imageName?imageName:"Изображение не выбрано"}/>
          </div>
    


    
    <IngredientSelection/>

    <p><Button onClick={handleSave}>Сохранить</Button>
    <Button onClick={handleCancel}>Отмена</Button></p>
  </div>
    ):(
      <div>
        <p><strong>Название: </strong> {pizza.name}</p>
        <p><strong>Описание: </strong> {pizza.description}</p>
        <IngredientNames names={updatedPizza.ingredients.map(ingr => ingr.name)}/>
        <p><strong>{pizza.isAvailable? "В ассортименте": "Отсутствует"}</strong></p>
        <p>{pizza.image && <img src={`${IMAGE_BASE_URL}${pizza.image}`}alt={pizza.name} width="450px"/>}</p>
        <p><Button onClick={() => {
          

          setEditMode(true);

        }
        }>Редактировать</Button>
        <Button onClick={()=>{
          context?.setSelectedIngredientIds([]);
          navigate("/pizzas");
        }}>Назад</Button></p>
    
  </div>
    )}
    </div>
)
}

export default PizzaDetails