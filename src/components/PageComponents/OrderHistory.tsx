import React, { useContext, useEffect } from "react"
import { PizzaContext } from "../../contexts/PizzaContext"
import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Chip, CircularProgress, Grid, Paper, Typography } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import {format, parseISO} from 'date-fns'
import {ru} from 'date-fns/locale'
import { toZonedTime } from "date-fns-tz"
import { AccessTime, Cancel, CancelOutlined, CheckCircleOutline, DeliveryDining, InfoOutlined, LocalShipping, LocationOn, OutdoorGrill } from "@mui/icons-material"
import { useState } from "react"
import HistoryOrder, { OrderStatusEnum } from "../../models/HistoryOrder"
import OrderDetails from "./OrderDetails"
import orderService from "../../services/OrderService"
import ErrorBoundary from "../../errorHandling/ErrorBoundary"
import { formatDateForInput } from "../../pathUtils/dateHelper"


/**
 * Компонент для отображения списка пицц
 */
const OrderHistory: React.FC = () => {
  const context = useContext(PizzaContext) //Получаем доступ к глобальному состоянию из контекста
  const navigate = useNavigate() //Хук для программной навигации между страницами
const [selectedOrder, setSelectedOrder]=useState<HistoryOrder|null>(null);
const [error, setError]=useState<string|null>(null);

  
  
    const { orders=[], loadMoreOrders=()=>{}, hasMoreOrders=null, setOrders=()=>{}, setSnackbarMessage =()=>{}, 
    setSnackbarOpen =()=>{}, setTypeInfo =()=>{}} = context||{}
    useEffect(()=>{
      const loadFunc = async()=>
        {
          try{
            loadMoreOrders(0);
          }
          catch(err){
            setError((err as Error).message);
          }
        }
        loadFunc();
      }, [])
      if(error)
        return <div>{error}</div>
      const handleDelete = async (id:number)=>{
        const isConfirmed = window.confirm("Вы уверены, что хотите отменить этот заказ?")
        try{
          if(isConfirmed){
          await cancelOrder(id);
        }
      } catch(err){
        setSnackbarMessage(`Ошибка отмены: ${(err as Error).message}`);
        setTypeInfo('error');
        setSnackbarOpen(true);
      }
    }

    /**
     * Функция отмены заказа
     * @param id - идентификатор отменяемого заказа
     */
const cancelOrder=async(id:number)=>{
  const updatedOrder = await orderService.cancelOrder(id);
  const formattedOrder={
                ...updatedOrder,
                completionTime:updatedOrder.completionTime? formatDateForInput(updatedOrder.completionTime):null,
                cancellationTime:updatedOrder.cancellationTime ? formatDateForInput(toZonedTime(updatedOrder.cancellationTime,'UTC').toString()):null,
                  orderTime:formatDateForInput(updatedOrder.orderTime),
                acceptedTime:updatedOrder.acceptedTime?formatDateForInput(updatedOrder.acceptedTime):null,
                 endCookingTime:updatedOrder.endCookingTime?formatDateForInput(updatedOrder.endCookingTime):null,
                 deliveryStartTime:updatedOrder.deliveryStartTime?formatDateForInput(updatedOrder.deliveryStartTime):null
              };
              console.log("OLD:",updatedOrder);
              console.log("NEW:", formattedOrder);
              setOrders(orders.map(o=>o.id===id?formattedOrder:o));
}

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">История заказов</Typography>
        
       
      </Box>
      

      {orders.map((o) => (
        <ErrorBoundary key={o.id} fallback={<div>Не удалось отобразить заказ №{o.id}</div>}>
          <Paper sx={{p:3, mb:3, borderRadius:2}}>
            <Box display="flex" justifyContent="space-between" alignItems="center"
            mb={2}>
                <Typography variant="h4">
                    Заказ №{o.id}
                </Typography>
                <Chip
                label={o.status}
                color={
                    o.status==='Отменен'|| o.status==='Не доставлен' ? 'error':
                    'success'
                }
                variant="outlined"
                sx={{
                    fontWeight:500,
                    fontSize:'1.0rem',
                    textTransform:'uppercase'
                }}
                />
            </Box>
            <Grid container spacing={2}>
      <Grid>
        <Box mb={2}>
          <Typography variant="h5" color="text.secondary">
            <AccessTime fontSize="large" sx={{ mr: 2, verticalAlign: 'middle' }} />
            Заказ оформлен: {o.orderTime}
          </Typography>
        </Box>

        {o.acceptedTime && (
          <Box mb={2}>
            <Typography variant="h5" color="text.secondary">
              <CheckCircleOutline fontSize="large" sx={{ mr: 2, verticalAlign: 'middle' }} />
              Принят: {o.acceptedTime}
            </Typography>
          </Box>
        )}
         {o.endCookingTime &&(
                          <Box mb={2}>
                          <Typography variant="h5" color="text.secondary">
                            <OutdoorGrill fontSize="large" sx={{ mr: 2, verticalAlign: 'middle' }} />
                            Готов к отправке: {o.endCookingTime}
                          </Typography>
                        </Box>
                        )}

        {o.deliveryStartTime && (
          <Box mb={2}>
            <Typography variant="h5" color="text.secondary">
              <LocalShipping fontSize="large" sx={{ mr: 2, verticalAlign: 'middle' }} />
              Доставка начата: {o.deliveryStartTime}
            </Typography>
          </Box>
        )}
        {o.completionTime && (
            <Box mb={2}>
                <Typography variant="h5" color="text.secondary">
                    <DeliveryDining fontSize="large" sx={{mr:2, verticalAlign:"middle"}}/>
                    {o.statusId===OrderStatusEnum.IsDelivered ? (
                      <>Доставлено: {o.completionTime}</>
                    ): (
                      <>Не доставлен: {o.completionTime}</>
                  )}
                  
                </Typography>
            </Box>
        )}
        {o.cancellationTime && (
          <Box mb={2}>
          <Typography variant="h5" color="text.secondary">
              <Cancel fontSize="large" sx={{mr:2, verticalAlign:"middle"}}/>
              Отменено: {o.cancellationTime}
          </Typography>
      </Box>
        )}
      </Grid>

      <Grid>
        <Box mb={2}>
          <Typography variant="h6">
            <LocationOn fontSize="medium" sx={{ mr: 2, verticalAlign: 'middle' }} />
            Адрес доставки: {o.address}
          </Typography>
        </Box>

        <Box sx={{ 
          backgroundColor: '#f5f5f5',
          p: 2,
          borderRadius: 1
        }}>
          <Typography variant="h6" color="primary">
            Стоимость заказа: {o.price.toFixed(2)} ₽
          </Typography>
        </Box>
      </Grid>
    </Grid>

    <Box sx={{ 
      mt: 2,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 2
    }}>
      <Button 
        variant="contained" 
        // component={Link} 
        // to={`/orders/${o.id}`}
        startIcon={<InfoOutlined />}
        onClick={()=>setSelectedOrder(o)}
      >
        Подробнее
      </Button>

      {!o.isCancelled && !o.isDelivered && (
        <Button 
          variant="outlined" 
          
          onClick={() => handleDelete(o.id)}
          startIcon={<CancelOutlined />}
        >
          Отменить заказ
        </Button>
      )}
    </Box>
  </Paper>
  </ErrorBoundary>
))}
{selectedOrder &&
(
  <OrderDetails
  order={selectedOrder}
  open={!!selectedOrder}
  onClose={()=>setSelectedOrder(null)}
  />
)}

   </Box>
  )

}

export default OrderHistory

