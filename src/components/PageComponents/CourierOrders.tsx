import React, { useContext, useEffect, useState } from "react"
import { PizzaContext } from "../../contexts/PizzaContext"
import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
// import {format, parseISO} from 'date-fns'
// import {ru} from 'date-fns/locale'
import {toZonedTime, format} from 'date-fns-tz'
import { AccessTime, Cancel, CancelOutlined, OutdoorGrill, CheckCircleOutline, DeliveryDining, DirectionsBike, InfoOutlined, LocalShipping, LocationOn, ThumbDownAlt, ThumbUpAlt } from "@mui/icons-material"
import HistoryOrder from "../../models/HistoryOrder"
import OrderDetails from "./OrderDetails"
import { StatusFilter } from "./StatusFilter"
import { OrderStatusEnum } from "../../models/HistoryOrder"
import { DeliveryDialog } from "./DeliveryDialog"
import orderService from "../../services/OrderService"
import deliveryService from "../../services/DeliveryService"
import ErrorBoundary from "../../errorHandling/ErrorBoundary"
import locale from "antd/es/date-picker/locale/en_US"
import { formatDateForInput } from "../../pathUtils/dateHelper"
const ALL_STATUSES_VALUE=0;



const basicStatusOptions = [
  { value: ALL_STATUSES_VALUE, label: 'Все заказы' },
  { value: OrderStatusEnum.IsBeingPrepared, label: 'Готовится' },
  { value: OrderStatusEnum.IsBeingTransferred, label: 'Передается в доставку' },
  { value: OrderStatusEnum.HasBeenTransferred, label: 'Передан курьеру' },
  { value: OrderStatusEnum.IsDelivered, label: 'Доставлен' },
  { value: OrderStatusEnum.IsNotDelivered, label: 'Не доставлен' },
];

/**
 * Комопнент отобрадения курьеру списка заказов
 */
const CourierOrders: React.FC = () => {
  const context = useContext(PizzaContext) //Получаем доступ к глобальному состоянию из контекста
  if(!context)
    throw new Error("Ошибка при получении данных из контекста");
  const navigate = useNavigate() //Хук для программной навигации между страницами
const [selectedOrder, setSelectedOrder]=useState<HistoryOrder|null>(null);
const [statusFilter, setStatusFilter]=useState<number>(ALL_STATUSES_VALUE);
const [deliveryDialogOpen, setDeliveryDialogOpen]=useState<boolean>(false);
const [currentOrderId, setCurrentOrderId]=useState<number|null>(null);
const [deliveryStatus, setDeliveryStatus]=useState<boolean>(true);
const [comment, setComment]=useState("");

/**
 * Опции фильтрации заказов для курьеров
 */
const statusOptions = [
  
    { value: "Передается в доставку", label: "Готовы к доставке" },
    { value: "Доставлен", label: "Доставленные" },
    { value: "не доставлен", label: "Не доставленные" },
  ];
  const { orders=[], setOrders=()=>{}, loadMoreOrders=()=>{}, hasMoreOrders=null } = context||{}
  useEffect(()=>{
      loadMoreOrders(0);
    }, [])

    /**
     * Открытие окна
     * @param {number} orderId - идентификатор заказа
     */
  const handleOpenDeliveryDialog = (orderId: number) => {
    setCurrentOrderId(orderId);
    setDeliveryDialogOpen(true);
  };

  /**
   * Обработка закрытия окна
   */
  const handleCloseDeliveryDialog = () => {
    setDeliveryDialogOpen(false);
    setDeliveryStatus(true);
    setComment("");
  };

  /**
   * Выбор курьером заказа для последующей доставки
   * @param {number} id - идентификатор заказа
   */
  const chooseOrder = async(id:number)=>{
    const updatedOrder=await orderService.chooseOrder(id);
    const formattedOrder={
      ...updatedOrder,
      completionTime:updatedOrder.completionTime? formatDateForInput(updatedOrder.completionTime):null,
      cancellationTime:updatedOrder.cancellationTime ? formatDateForInput(updatedOrder.cancellationTime):null,
        orderTime:formatDateForInput(updatedOrder.orderTime),
      acceptedTime:updatedOrder.acceptedTime?formatDateForInput(updatedOrder.acceptedTime):null,
       endCookingTime:updatedOrder.endCookingTime?formatDateForInput(updatedOrder.endCookingTime):null,
       deliveryStartTime:updatedOrder.deliveryStartTime?formatDateForInput(toZonedTime(updatedOrder.deliveryStartTime,'UTC').toString()) :null
    };
    console.log("OLD:",updatedOrder);
    console.log("NEW:", formattedOrder);
    setOrders(orders.map(o=>o.id===id?formattedOrder:o));
  }

  /**
   * 
   * @param {number} id - идентификатор заказа
   * @param {boolean} status - статус (True, если доставлен)
   * @param {string} comment - комментарий
   */
  const completeDelivery=async(id:number, status:boolean, comment:string)=>{
    console.log("IAMHERE");
    const updatedOrder=await deliveryService.completeDelivery(id, status, comment);
    const formattedOrder={
      ...updatedOrder,
      completionTime:updatedOrder.completionTime ? formatDateForInput(toZonedTime(updatedOrder.completionTime, 'UTC').toString()):null,
      cancellationTime:updatedOrder.cancellationTime ? formatDateForInput(updatedOrder.cancellationTime):null,
        orderTime:formatDateForInput(updatedOrder.orderTime),
      acceptedTime:updatedOrder.acceptedTime?formatDateForInput(updatedOrder.acceptedTime):null,
       endCookingTime:updatedOrder.endCookingTime?formatDateForInput(updatedOrder.endCookingTime):null,
       deliveryStartTime:updatedOrder.deliveryStartTime?formatDateForInput(updatedOrder.deliveryStartTime):null
    };
    console.log("OLD:",updatedOrder);
    console.log("NEW:", formattedOrder);
    setOrders(orders.map(o=>o.id===id?formattedOrder:o));
  }

  /**
   * Обработчик совершения доставки (недоставки) курьером заказа
   */
  const handleSubmitDelivery = async () => {
    if (currentOrderId) {
        console.log(currentOrderId+" "+deliveryStatus+ " "+comment+" ");
      await completeDelivery(currentOrderId, deliveryStatus, comment);
      handleCloseDeliveryDialog();
    }
  };

  /**
   * Обработчик выбора курьером заказа
   * @param {number} orderId - идентификатор заказа
   */
  const handleChoosingOrder=(orderId:number)=>{
    chooseOrder(orderId);
  }
  


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
          <Typography variant="h4">Управление заказами </Typography>
          <StatusFilter
                    value={statusFilter ?? ALL_STATUSES_VALUE}
                    onChange={(newStatus)=>{
                      setStatusFilter(newStatus);
                      loadMoreOrders(newStatus);
                    }}
                    statusOptions={basicStatusOptions}/>
          
        </Box>
      </Box>
       
      </Box>
      
      {orders.map((o) => (
         <ErrorBoundary key={o.id} fallback={<div>Не удалось отобразить заказ №{o.id}</div>}>
        <Paper key={o.id} sx={{p:3, mb:3, borderRadius:2}}>
            <Box display="flex" justifyContent="space-between" alignItems="center"
            mb={2}>
                <Typography variant="h4">
                    Заказ №{o.id}
                </Typography>
                <Chip
                label={o.status}
                color={
                    // o.status==='Доставлен' ? 'success':
                    o.statusId===OrderStatusEnum.IsCancelled|| o.statusId===OrderStatusEnum.IsNotDelivered ? 'error':
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

        {o.statusId>=OrderStatusEnum.IsBeingPrepared && (
          <Box mb={2}>
            <Typography variant="h5" color="text.secondary">
              <CheckCircleOutline fontSize="large" sx={{ mr: 2, verticalAlign: 'middle' }} />
              Принят: {o.acceptedTime}
            </Typography>
          </Box>
        )}

         {o.statusId>=OrderStatusEnum.IsBeingTransferred &&(
                  <Box mb={2}>
                  <Typography variant="h5" color="text.secondary">
                    <OutdoorGrill fontSize="large" sx={{ mr: 2, verticalAlign: 'middle' }} />
                    Готов к отправке: {o.endCookingTime}
                  </Typography>
                </Box>
                )}

        {o.statusId>=OrderStatusEnum.HasBeenTransferred && (
          <Box mb={2}>
            <Typography variant="h5" color="text.secondary">
              <LocalShipping fontSize="large" sx={{ mr: 2, verticalAlign: 'middle' }} />
              Доставка начата: {o.deliveryStartTime}
            </Typography>
          </Box>
        )}

        {(o.statusId===OrderStatusEnum.IsDelivered || o.statusId===OrderStatusEnum.IsNotDelivered) && (
                    <Box mb={2}>
                        <Typography variant="h5" color="text.secondary">
                            <DeliveryDining fontSize="large" sx={{mr:2, verticalAlign:"middle"}}/>
                            {o.statusId===OrderStatusEnum.IsDelivered ? (
                              <>Доставлено: {`${o.completionTime}`}</>
              
                            ): (
                              <>Не доставлен: {`${o.completionTime}`}</>
                          )}
                          
                        </Typography>
                    </Box>
                )}
        {o.statusId===OrderStatusEnum.IsCancelled&& (
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

      {o.status==="Передается в доставку" && (
        <Button 
          variant="contained" 
          
          onClick={() => handleChoosingOrder(o.id)}
          startIcon={<CheckCircleOutline />}
        >
          Принять заказ
        </Button>
      )}
      {o.status === "Передан курьеру" && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleOpenDeliveryDialog(o.id)}
                startIcon={<DirectionsBike />}
              >
                Отметить по доставке
              </Button>
            )}
    </Box>
  </Paper>
  </ErrorBoundary>
))}

      <DeliveryDialog
      open={deliveryDialogOpen}
      onClose={handleCloseDeliveryDialog}
      onSubmit={handleSubmitDelivery}/>
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

export default CourierOrders