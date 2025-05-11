import React, { useState, useContext } from "react"
import { PizzaContext } from "../../contexts/PizzaContext"
import { useNavigate } from "react-router-dom"
import {NewPizza} from "../../models/NewPizza" // Интерфейс для описания структуры новой пиццы
import { Box, Button, Checkbox, FormControlLabel, TextareaAutosize, TextField } from "@mui/material"
import IngredientSelection from "./IngredientSelection"
import { NewIngredient } from "../../models/NewIngredient"
import ingredientService from "../../services/IngredientService"


/**
 * Компонент добавления нового ингредиента
 */
const IngredientForm: React.FC = () => {
  const context = useContext(PizzaContext) // оступ к контексту пиццы
  const navigate = useNavigate() //Хук для перехода между страницами
const [imageName, setImageName] = useState<string>("")
  const [newIngredient, setNewIngredient] = useState<NewIngredient>({
 name: "Новый ингредиент",
    description: "Описание нового ингредиента",
    isAvailable:true,
    image: null,
    pricePerGram:0.00,
    big:0,
    medium:0,
    small:0
  })
if(!context)
  return <div></div>
const {ingredients, setIngredients}=context;
 

/**
 * Обработчик отправки формы
 * @param e - событие отправки формы
 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Проверяем заполнение всех полей
    if (!newIngredient.name.trim() || !newIngredient.description.trim()||!!!newIngredient.big||!!!newIngredient.small||!!!newIngredient.medium) {
      alert("Заполните все требуемые поля и укажите состав пиццы")
      return
    }

if(context){
  await addIngredient(newIngredient);
  setNewIngredient({
    name:"",
    description:"",
    isAvailable:true,
    image:null,
    big:0,
    small:0,
    medium:0,
    pricePerGram:0
  });
  context.setSelectedIngredientIds([]);
  navigate("/ingredients");
}

  }
    const addIngredient=async(ingrData:NewIngredient)=>{
      const newIngredient = await ingredientService.createIngredient(ingrData);
      const updatedIngredients = [...ingredients, newIngredient];
      setIngredients(updatedIngredients);
    }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавление нового ингредиента</h2>
      <div>
        <p>Название:</p>

<TextField
              
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
             
              required
              
              
             
            />

      
      </div>
      <div>
        <p>Описание:</p>
        <TextareaAutosize
          placeholder="Описание"
          // color="#9c27b0"
          value={newIngredient.description}
          required // Поле обязательно для заполнения
          onChange={(e) => setNewIngredient({ ...newIngredient, description: e.target.value })}
        />
      </div>
   
      <FormControlLabel
            control={
              <Checkbox checked={newIngredient.isAvailable} onChange={(e)=>{
                setNewIngredient({
                  ...newIngredient, isAvailable:e.target.checked,
                });
              }} />
            }
            label={newIngredient.isAvailable? "Ингредиент уже в ассортименте":"Ингредиент временно отсутствует"}
          />
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
       

        onChange={(e)=>setNewIngredient({...newIngredient, pricePerGram:Number(e.target.value)})}
        fullWidth
        required
        sx={{mb: 2}}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        label="Количество в маленьких пиццах (г)"
        

        onChange={(e)=>setNewIngredient({...newIngredient, small:Number(e.target.value)})}
        fullWidth
        required
        sx={{mb: 2}}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        label="Количество в средних пиццах (г)"
        

        onChange={(e)=>setNewIngredient({...newIngredient, medium:Number(e.target.value)})}
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

        onChange={(e)=>setNewIngredient({...newIngredient, big:Number(e.target.value)})}
        
        required
        sx={{mb: 2}}
        InputLabelProps={{
          shrink: true
        }}
      />
      </Box>
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
              setNewIngredient((prev)=>({
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
      
     
      <Button sx={{marginTop:"10px"}} type="submit">Добавить ингредиент</Button> {/* Кнопка для отправки данных */}
      <Button sx={{marginTop:"10px"}} type="button" onClick={() => {
        context?.setSelectedIngredientIds([]);
        navigate("/ingredients")
      }}>
        Назад
      </Button>
      
    </form>
  )
}

export default IngredientForm