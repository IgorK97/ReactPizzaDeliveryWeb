import React, { useContext } from "react"
import { PizzaContext } from "../../contexts/PizzaContext"
import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import ingredientService from "../../services/IngredientService"
import { IMAGE_BASE_URL } from "../../pathUtils/imagePath"


/**
 * Компонент для отображения ингредиентов для менеджера
 */
const IngredientManagerList: React.FC = () => {
  const context = useContext(PizzaContext) //Получаем доступ к глобальному состоянию из контекста
  const navigate = useNavigate() //Хук для программной навигации между страницами

  if (!context) return <div>Ошибка при получении данных контекста!</div>
 
  const { ingredients, setIngredients } = context
const handleDelete = (id:number)=>{
  const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот ингредиент?")
if(isConfirmed){
  deleteIngredient(id)
}
}
const deleteIngredient=async(id:number)=>{
  await ingredientService.deleteIngredient(id);
  setIngredients(ingredients.filter((ingr)=>ingr.id!==id));
    }
  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Список ингредиентов</Typography>
       
      </Box>
      
      <Button variant="contained" onClick={() => navigate("/ingredients/add")}>Добавить новый ингредиент</Button>

      <Grid container spacing={3}>
      {ingredients.map((ingr) => (
        <Grid size={{xs:12, sm: 7, md:4, lg: 4, xl:4}} key={ingr.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', background:'white' }}> 
          <CardContent><Box sx={{ 
          p: 2, 
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 2 
        }}> 
          <h3>{ingr.name}</h3>
          <p>{ingr.description}</p>
          <p>{ingr.isAvailable? "В ассортименте": "Отсутствует"}</p>
          {ingr.image && <img src={`${IMAGE_BASE_URL}${ingr.image}`} alt={ingr.name} style={{width: "200px"}}/>}
          <p><Link to={`/ingredients/${ingr.id}`}>Изменить</Link> </p>
        <p><Button variant="contained" onClick={()=>handleDelete(ingr.id)}>Удалить</Button></p>
        </Box>
        </CardContent>
        </Card>
        </Grid>
      ))}
      </Grid>
   </Box>
  )
}

export default IngredientManagerList