import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PizzaContext } from "../../contexts/PizzaContext"
import { Pizza } from "../../models/pizza"
import { NewPizza } from "../../models/NewPizza"
import { Box, Button, Checkbox, FormControlLabel, TextareaAutosize, TextField } from "@mui/material"
import IngredientSelection from "./IngredientSelection"
import { Ingredient } from "../../models/ingredient"
import { NewIngredient } from "../../models/NewIngredient"
import ingredientService from "../../services/IngredientService"
import { IMAGE_BASE_URL } from "../../pathUtils/imagePath"


/**
 * Компонент редактирования ингредиента
 */
const IngredientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>() //Получаем ID пиццы из параметров URL
  const context = useContext(PizzaContext) //Доступ к контексту пицц
  const navigate = useNavigate() //Для перехода между страницами
const [imageName, setImageName]=useState<string>("");
  const [ingredient, setIngredient] = useState<Ingredient | null>(null) //Храним текущий ингредиент
const [editMode, setEditMode]=useState<boolean>(false)
const [updatedIngredient, setUpdatedIngredient]=useState<Ingredient|null>(null)
const [imageFile,setImageFile]=useState<string|null>(null)
  useEffect(() => {
    if (context) {
      const foundIngredient = context.ingredients.find((piz) => piz.id === parseInt(id || "", 10));
      if(foundIngredient){
        setIngredient(foundIngredient);
        setUpdatedIngredient(foundIngredient);
      }
    }
  }, [])

  if (!ingredient || !updatedIngredient || !context) {
    return <div>Ингредиент не найден!</div> // Сообщение, если пицца не найдена
  }
  const {setIngredients, ingredients}=context;


/**
 * Обработчик отмены редактирования
 */
const handleCancel=()=>{
  
  setEditMode(false);
  setUpdatedIngredient(ingredient);
  setImageFile(null);
  context?.setSelectedIngredientIds([]);
  // navigate("/pizzas");
}

/**
 * Обработчик сохранения изменений
 */
const handleSave=async ()=>{
  if(!context||!updatedIngredient) return;
const ingredientToSave:NewIngredient={
  name:updatedIngredient.name,
  description:updatedIngredient.description,
  isAvailable:updatedIngredient.isAvailable,
  image:imageFile,
  big:updatedIngredient.big,
  medium:updatedIngredient.medium,
  small:updatedIngredient.small,
  pricePerGram:updatedIngredient.pricePerGram
}



const updatedIngr = await updateIngredient(updatedIngredient.id,ingredientToSave);
setUpdatedIngredient(updatedIngr);
setIngredient(updatedIngr);
console.log("IAMHERE", updatedIngr);
setEditMode(false);
}
/**
 * Обновление ингредиента
 * @param id - идентификатор обновляемого ингредиента
 * @param updatedIngredient - обновляемый ингредиент
 */
  const updateIngredient = async (id:number, updatedIngredient:NewIngredient)=>{
    const updatedIngr = await ingredientService.updateIngredient(id, updatedIngredient);
    setIngredients(ingredients.map((ingr)=>(ingr.id===id? updatedIngr:ingr)));
    return updatedIngr;
  }
return (
  <div>
    <h2>Ингредиент</h2>
    {editMode?(
      <div>
        <div><p>Название:</p>
        
        <TextField
                      
                      value={updatedIngredient.name}
                      onChange={(e)=>{
                        setUpdatedIngredient({...updatedIngredient, name:e.target.value})
                      }}
                     
                      required
                      
                      
                     name="name"
                    />

             </div>
        <div>
        <p>Описание:</p>
        <TextareaAutosize
          placeholder="Описание"
          value={updatedIngredient.description}
          required
          onChange={(e)=>{
            setUpdatedIngredient({...updatedIngredient, description:e.target.value})
          }}
          name="description"
        />
      </div>
<div>
  <FormControlLabel
              control={
                <Checkbox checked={updatedIngredient.isAvailable} onChange={()=>{
  setUpdatedIngredient({...updatedIngredient, isAvailable: !updatedIngredient.isAvailable})

                }} />
              }
              label={updatedIngredient.isAvailable? "Ингредиент уже в ассортименте":"Ингредиент временно отсутствует"}
            />
    </div>
    <div>
    <p>Изображение в базе данных: </p>
    {ingredient.image&&<img src={`${IMAGE_BASE_URL}${ingredient.image}`}alt={ingredient.image} width="200px"/>}
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
          <Box 
  sx={{ 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
    width: '300px',
    mb: 3
  }}
>
          <TextField
        label="Цена за грамм (руб)"
       
        value={updatedIngredient.pricePerGram ?? ""}
        onChange={(e)=>setUpdatedIngredient({...updatedIngredient, pricePerGram:Number(e.target.value)})}
        fullWidth
        required
        sx={{mb: 2}}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        label="Количество в маленьких пиццах (г)"
        
        value={updatedIngredient.small ?? ""}
        onChange={(e)=>setUpdatedIngredient({...updatedIngredient, small:Number(e.target.value)})}
        fullWidth
        required
        sx={{mb: 2}}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        label="Количество в средних пиццах (г)"
        
        value={updatedIngredient.medium ?? ""}
        onChange={(e)=>setUpdatedIngredient({...updatedIngredient, medium:Number(e.target.value)})}
        fullWidth
        required
        sx={{mb: 2}}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        label="Количество в больших пиццах (г)"
       fullWidth
        value={updatedIngredient.big ?? ""}
        onChange={(e)=>setUpdatedIngredient({...updatedIngredient, big:Number(e.target.value)})}
        
        required
        sx={{mb: 2}}
        InputLabelProps={{
          shrink: true
        }}
      />
      </Box>

    
  

    <p><Button onClick={handleSave}>Сохранить</Button>
    <Button onClick={handleCancel}>Отмена</Button></p>
  </div>
    ):(
      <div>
        <p><strong>Название: </strong> {ingredient.name}</p>
        <p><strong>Описание: </strong> {ingredient.description}</p>
        <p><strong>{ingredient.isAvailable? "В ассортименте": "Отсутствует"}</strong></p>
        <p>{ingredient.image && <img src={`${IMAGE_BASE_URL}${ingredient.image}`}alt={ingredient.name} width="200px"/>}</p>
        <p><strong>Цена за грамм, руб: </strong> {ingredient.pricePerGram}</p>
        <p><strong>Граммов в маленькой пицце: </strong> {ingredient.small}</p>
        <p><strong>Граммов в средней пицце: </strong> {ingredient.medium}</p>
        <p><strong>Граммов в большой пицце: </strong> {ingredient.big}</p>
        <p><Button onClick={() => {
          
          setEditMode(true);

        }
        }>Редактировать</Button>
        <Button onClick={()=>{
          context?.setSelectedIngredientIds([]);
          navigate("/ingredients");
        }}>Назад</Button></p>
    
  </div>
    )}
    </div>
)
}

export default IngredientDetails