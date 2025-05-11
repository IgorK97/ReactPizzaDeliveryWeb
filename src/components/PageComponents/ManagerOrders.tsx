import React, { useContext, useEffect, useState } from "react"
import { PizzaContext } from "../../contexts/PizzaContext"
import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Chip, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Typography } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import {format, parseISO} from 'date-fns'
import {ru} from 'date-fns/locale'
import { toZonedTime } from "date-fns-tz"
import { AccessTime, Cancel, CancelOutlined, CheckCircleOutline, OutdoorGrill, DeliveryDining, DirectionsBike, InfoOutlined, LocalShipping, LocationOn } from "@mui/icons-material"
import HistoryOrder from "../../models/HistoryOrder"
import OrderDetails from "./OrderDetails"
// import { Select } from "antd"
import {Select} from "@mui/material"
import { OrderStatusEnum } from "../../models/HistoryOrder"
import { StatusFilter } from "./StatusFilter"
import { useAuth } from "../../contexts/AuthContext"
import { UserRole } from "../../models/UserRole"
import orderService from "../../services/OrderService"
import deliveryService from "../../services/DeliveryService"
import ErrorBoundary from "../../errorHandling/ErrorBoundary"
import { formatDateForInput } from "../../pathUtils/dateHelper"

const ALL_STATUSES_VALUE=0;


/**
 * Компонент для отобрадения списка заказов менеджеру
 */
const ManagerOrders: React.FC = () => {
  const context = useContext(PizzaContext) //Получаем доступ к глобальному состоянию из контекста
  const navigate = useNavigate() //Хук для программной навигации между страницами
const [selectedOrder, setSelectedOrder]=useState<HistoryOrder|null>(null);
const [statusFilter, setStatusFilter]=useState<number>(ALL_STATUSES_VALUE);

//Опции фильтрации у менеджера
const managerStatusOptions = [
  { value: ALL_STATUSES_VALUE, label: 'Все заказы' },
  { value: OrderStatusEnum.IsBeignFormed, label: 'Формируется' },
  { value: OrderStatusEnum.IsBeingPrepared, label: 'Готовится' },
  { value: OrderStatusEnum.IsBeingTransferred, label: 'Передается в доставку' },
  { value: OrderStatusEnum.HasBeenTransferred, label: 'Передан курьеру' },
  { value: OrderStatusEnum.IsCancelled, label: 'Отменен' },
  { value: OrderStatusEnum.IsDelivered, label: 'Доставлен' },
  { value: OrderStatusEnum.IsNotDelivered, label: 'Не доставлен' },
];





  const { orders=[], loadMoreOrders=()=>{}, hasMoreOrders=null, setOrders=()=>{} } = context||{}
  const {userRole, isAuthReady} = useAuth();;
  useEffect(()=>{
      if(userRole===UserRole.Manager)
        {

          loadMoreOrders(statusFilter);
        }
    }, [userRole, isAuthReady])

    /**
     * функция принятия заказа менеджером
     * @param id - идентификатор заказа
     */
    const acceptOrder=async(id:number)=>{
      const updatedOrder=await orderService.acceptOrder(id);
      const formattedOrder={
            ...updatedOrder,
            completionTime:updatedOrder.completionTime? formatDateForInput(updatedOrder.completionTime):null,
            cancellationTime:updatedOrder.cancellationTime ? formatDateForInput(updatedOrder.cancellationTime):null,
              orderTime:formatDateForInput(updatedOrder.orderTime),
            acceptedTime:updatedOrder.acceptedTime?formatDateForInput(toZonedTime(updatedOrder.acceptedTime,'UTC').toString()):null,
             endCookingTime:updatedOrder.endCookingTime?formatDateForInput(updatedOrder.endCookingTime):null,
             deliveryStartTime:updatedOrder.deliveryStartTime?formatDateForInput(updatedOrder.deliveryStartTime):null
          };
          console.log("OLD:",updatedOrder);
          console.log("NEW:", formattedOrder);
          setOrders(orders.map(o=>o.id===id?formattedOrder:o));
      // setOrders(orders.map(o=>o.id===id?updatedOrder:o));
    }

    /**
     * Фукнция передачи заказа в доставку (изменения состояние на передается в доставку)
     * @param id - идентификатор заказа
     */
      const transferToDelivery=async(id:number)=>{
        const updatedOrder=await deliveryService.transferToDelivery(id);
        const formattedOrder={
              ...updatedOrder,
              completionTime:updatedOrder.completionTime? formatDateForInput(updatedOrder.completionTime):null,
              cancellationTime:updatedOrder.cancellationTime ? formatDateForInput(updatedOrder.cancellationTime):null,
                orderTime:formatDateForInput(updatedOrder.orderTime),
              acceptedTime:updatedOrder.acceptedTime?formatDateForInput(updatedOrder.acceptedTime):null,
               endCookingTime:updatedOrder.endCookingTime?formatDateForInput(toZonedTime(updatedOrder.endCookingTime,'UTC').toString()):null,
               deliveryStartTime:updatedOrder.deliveryStartTime?formatDateForInput(updatedOrder.deliveryStartTime):null
            };
            console.log("OLD:",updatedOrder);
            console.log("NEW:", formattedOrder);
            setOrders(orders.map(o=>o.id===id?formattedOrder:o));
        // setOrders(orders.map(o=>o.id===id?updatedOrder:o));
      }
  



      // const handleStatusChange=(orderId:number, newStatus:string)=>{
      //   if(newStatus==="Готовится"){
      //       acceptOrder(orderId);
      //   }else if(newStatus==="Передается в доставку"){
      //       transferToDelivery(orderId);
      //   }
      //   };


  return (
    <Box sx={{ padding: 3 }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">История заказов</Typography>
        <Box sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "background.paper",
        py: 2,
        mb: 3,
        boxShadow: 1
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4">Управление заказами</Typography>
          <StatusFilter
          value={statusFilter ?? ALL_STATUSES_VALUE}
          onChange={(newStatus)=>{
            setStatusFilter(newStatus);
            if(userRole===UserRole.Manager)
              loadMoreOrders(newStatus);
          }}
          statusOptions={managerStatusOptions}/>
      
        </Box>
      </Box>
       
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
                    // o.status==='Доставлен' ? 'success':
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

      {o.status==="Формируется" && (
        <Button 
          variant="contained" 
          
          onClick={() => acceptOrder(o.id)}
          startIcon={<CheckCircleOutline />}
        >
          Принять заказ
        </Button>
      )}
      {o.status === "Готовится" && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => transferToDelivery(o.id)}
                startIcon={<DirectionsBike />}
              >
                Передать в доставку
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

export default ManagerOrders
