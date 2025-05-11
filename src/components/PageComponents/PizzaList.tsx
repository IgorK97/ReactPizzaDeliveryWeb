import React, { useContext, useState } from "react"
import { PizzaContext } from "../../contexts/PizzaContext"
import { Link, useNavigate } from "react-router-dom"
import { Alert, Box, Button, CircularProgress, Grid, Snackbar, Typography } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import pizzaService from "../../services/PizzaService"
import { IMAGE_BASE_URL } from "../../pathUtils/imagePath"
import ErrorBoundary from "../../errorHandling/ErrorBoundary"

/**
 * Компонент для отображения списка пицц
 * 
 */
const PizzaList: React.FC = () => {
  const context = useContext(PizzaContext) //Получаем доступ к глобальному состоянию из контекста
  const navigate = useNavigate() //Хук для программной навигации между страницами

  if (!context) return <div>Данные пока отсутствуют, повторите попытку позже</div>
 
  const { pizzas, setPizzas, loadMorePizzas, hasMore, setSnackbarMessage, setTypeInfo, setSnackbarOpen } = context


  /**
   * Обработчик удаления пиццы
   * @param {number} id - идентификатор пиццы для удаления
   * @returns {void}
   */
  const handleDelete = async (id:number)=>{
    try{
      const isConfirmed = window.confirm("Вы уверены, что хотите удалить эту пиццу?");
      if(!isConfirmed)
        return;
    
      await pizzaService.deletePizza(id); //Удаление пиццы
      setPizzas(pizzas.filter((piz)=>piz.id!==id));
      setSnackbarMessage("Пицца успешно удалена!");
      setTypeInfo("success");
      setSnackbarOpen(true);
    } catch(err){
      setSnackbarMessage(`Ошибка при удалении пиццы: ${(err as Error).message}`);
      setTypeInfo("error");
      setSnackbarOpen(true);
    }
  }
  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Список пицц</Typography>
       
      </Box>
      
      <Button variant="contained" onClick={() => navigate("/pizzas/add")}>Добавить новую пиццу</Button>
<InfiniteScroll
        dataLength={pizzas.length}
        next={loadMorePizzas}
        hasMore={hasMore}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        }
        endMessage={
          <Typography variant="body2" textAlign="center" py={2}>
            Вы посмотрели все доступные пиццы!
          </Typography>
        }
      >
      <ErrorBoundary fallback={<div>Не удалось получить пиццы...</div>}>
      <Grid container spacing={3}>
      {pizzas?.map((piz) => (
        <Grid size={{xs:12, sm: 7, md:4, lg: 4, xl:4}} key={piz.id}>

          <h3>{piz.name}</h3>
          <p>{piz.description}</p>
          <p>{piz.isAvailable? "В ассортименте": "Отсутствует"}</p>
          <p>{piz.image && <img src={`${IMAGE_BASE_URL}${piz.image}`} alt={piz.name} style={{width: "300px"}}/>}</p>

          <Link to={`/pizzas/${piz.id}`}>Изменить</Link> 

        <p><Button variant="contained" onClick={()=>handleDelete(piz.id)}>Удалить</Button></p>
        </Grid>
      ))}
      </Grid>
      </ErrorBoundary>
      </InfiniteScroll>
      
   </Box>
  )
}

export default PizzaList

