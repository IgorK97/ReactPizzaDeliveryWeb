import React, { useState, useContext } from "react"
import { PizzaContext } from "../../contexts/PizzaContext"
import { useNavigate } from "react-router-dom"
import {NewPizza} from "../../models/NewPizza" // Интерфейс для описания структуры новой пиццы
import { Alert, Box, Button, Checkbox, FormControlLabel, Snackbar, TextareaAutosize, TextField } from "@mui/material"
import IngredientSelection from "./IngredientSelection"
import pizzaService from "../../services/PizzaService"

/**
 * 
 * Компонент для добавления новой пиццы
 * Позволяет создавать новую пиццу
 */
const PizzaForm: React.FC = () => {
  const context = useContext(PizzaContext) //Доступ к контексту пиццы
  const {pizzas, setPizzas, setSnackbarMessage, setSnackbarOpen, setTypeInfo}=context;
  const navigate = useNavigate() //Хук для перехода между страницами

//Состояние для данных пиццы и изображения
const [imageName, setImageName] = useState<string>("")
  const [newPizza, setNewPizza] = useState<NewPizza>({
 name: "Новая пицца",
    description: "Описание новой пиццы",
    isAvailable:true,
    image: null,
    defaultIngredientIds:[]
  })

  /**
   * Обработчик отправки формы для добавления новой пиццы
   * @param {React,FormEvent} e - событие отправки формы
   * @returns {void}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    if(!context)return;
    e.preventDefault()

    //Проверяем заполнение всех полей
    if (!newPizza.name.trim() || !newPizza.description.trim()||context?.selectedIngredientIds.length===0) {
      setSnackbarMessage("Заполните все требуемые поля и укажите состав пиццы");
      setTypeInfo("error");
      setSnackbarOpen(true);
      return;
    }

    try{
      newPizza.defaultIngredientIds=context.selectedIngredientIds;
      await addPizza(newPizza);
      setNewPizza({
        name:"",
        description:"",
        isAvailable:true,
        image:null,
        defaultIngredientIds:[]
      });
      context.setSelectedIngredientIds([]);
      navigate("/pizzas");
      setSnackbarMessage("Пицца успешно создана!");
      setTypeInfo("success");
      setSnackbarOpen(true);
    }catch(err){
      setSnackbarMessage(`Ошибка при создании пиццы: ${(err as Error).message}`);
      setTypeInfo("error");
      setSnackbarOpen(true);
    }

  }

  /**
   *  Фукнция для добавления пиццы через сервис
   * @param {NewPizza} pizzaData - данные новой пиццы
   */
  const addPizza = async (pizzaData: NewPizza) => {
    if(context){
      const newPizza = await pizzaService.createPizza(pizzaData)
      setPizzas([...pizzas ,newPizza]);
    }
  }
  return (
    <Box>
      <form onSubmit={handleSubmit}>
      <h2>Добавление новой пиццы</h2>
      <div>
        <p>Название:</p>

<TextField
              value={newPizza.name}
              onChange={(e) => setNewPizza({ ...newPizza, name: e.target.value })}
             
              required
            />

      </div>
      <div>
        <p>Описание:</p>
        <TextareaAutosize
          placeholder="Описание"
          value={newPizza.description}
          required 
          onChange={(e) => setNewPizza({ ...newPizza, description: e.target.value })}
        />
      </div>
   
      <FormControlLabel
            control={
              <Checkbox checked={newPizza.isAvailable} onChange={(e)=>{
                setNewPizza({
                  ...newPizza, isAvailable:e.target.checked,
                });
              }} />
            }
            label={newPizza.isAvailable? "Пицца уже в ассортименте":"Пицца временно отсутствует"}
          />
      <div>
      <FormControlLabel control={ 
        <Button
  variant="contained"
  component="label"
  sx={{marginRight:"5px"}}
>
  Загрузить изображение
<input hidden type="file" accept="image/png" onChange={(e)=>{
          if(e.target.files && e.target.files[0]){
            const file=e.target.files[0];
            setImageName(e.target.files[0].name);
            const reader=new FileReader();
            reader.readAsDataURL(file);

            reader.onload=()=>{

              setNewPizza((prev)=>({
                ...prev,
                image:reader.result as string,
              }));
            }

          }
        }}/>
       
</Button>
         }
         label={imageName?imageName:"Изображение не выбрано"}/>
      </div>
      
     
      

      <Box>
        <IngredientSelection/>
      </Box>
      <Button sx={{marginTop:"10px"}} type="submit">Добавить пиццу</Button> {/* Кнопка для отправки данных */}
      <Button sx={{marginTop:"10px"}} type="button" onClick={() => {
        context?.setSelectedIngredientIds([]);
        navigate("/pizzas")
      }}>
        Назад      {/* Кнопка для возврата назад */}
      </Button>
    </form>
    
    </Box>
  )
}

export default PizzaForm
