import React, { useContext, useState } from "react"
import { Drawer, List, Box, ListItem, Divider, Button, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar, Alert } from "@mui/material"
import {Card, IconButton, CardMedia} from "@mui/material"
import { CartItemCard } from "../PageComponents/CartItemCard"
// import { useLocation } from "react-router-dom"
import { Remove, Add, Close } from "@mui/icons-material"
import { PizzaContext } from "../../contexts/PizzaContext"
import { OrderItem } from "../../models/OrderItem"
import { NewOrderItem } from "../../models/NewOrderItem"
import PizzaDialog from "../PageComponents/PizzaDialog"
import { AuthContext} from "../../contexts/AuthContext"
import { useAuth } from "../../contexts/AuthContext"
import SubmitOrder from "../../models/SubmitOrder"
import orderService from "../../services/OrderService"
import cartService from "../../services/CartService"
import ErrorBoundary from "../../errorHandling/ErrorBoundary"

/**
 * интерфейс для типизации пропсов компоненты CartPanel
 */
interface CartProps{
open:boolean;
onClose:()=>void;
}

/**
 * Компонент CartPanel, содержащий корзину
 * @param {CartProp} props - пропсы, open - открыта ли корзина, onClose - действие при закрытии
 * @returns 
 */
const CartPanel: React.FC<CartProps>= ({open, onClose}) => {
    
    const context =useContext(PizzaContext);
    if(!context)
      <div>Данных контекста пока нет, попробуйте позже</div>
    const {address = null, setAddress=()=>{}, setCartId=()=>{}} = useAuth();
    const [editingItem, setEditingItem]=useState<OrderItem|null>(null);
    const [editing, setEditing]=useState<boolean>(false);
    const [openConfirm, setOpenConfirm]=useState(false);

    const {cart, pizzas, ingredients,
    selectedSize, selectedPizza, selectedQuantity, selectedIngredientIds,
    selectedItemId, setSelectedItemId, setSelectedPizza,
    setSelectedSize, cartId, setCart, setSnackbarMessage, 
    setSnackbarOpen, setTypeInfo} = context;
 
    /**
     * Удаление из корзины компонента (позиции) заказа
     * @param itemId - идентификатор строки заказа в корзине
     */
      const removeFromCart=async(itemId:number)=>{
        const updatedCart=await cartService.removeFromCart(itemId);
        setCart(updatedCart);
      }
      /**
       * Подтверждение заказа
       * @param {number} price - отображаемая клиенту цена
       * она отправляется на сервер только для того, чтобы сравнить с той ценой, что будет вычислена
       * на сервере. Если они будут отличаться, то покупка не состоится
       * @param {string} address - адрес
       */
        const submitOrder = async (price:number, address:string)=>{
          if(!!cartId){
            const orderInfo:SubmitOrder={
            id:cartId,
          price:price,
          address:address
          };
          const result = await orderService.submitOrder(orderInfo);

          setCart(result.updatedCart);
          setCartId(result.updatedCart.id);
          setSnackbarMessage(result.message);
            setSnackbarOpen(true);
          if(result.success){
          
              setTypeInfo("success");
          }
          else
          setTypeInfo("error");
          }
        }
          /**
           * Обновление позиции корзины клиентом
           * @param itemId - идентификатор позиции корзины (строки)
           * @param update - обновленная позиция
           */
        const updateCartItem = async (itemId:number, update:NewOrderItem)=>{
          const updatedCart=await cartService.updateCartItem(itemId, update);
          setCart(updatedCart);
        }


      /**
       * Обработка открытия окна
       */
      const handleClickOpen=()=>{
        setOpenConfirm(true);
      }
      /**
       * Обработка закрытия окна
       */
      const handleClose=()=>{
        setOpenConfirm(false);
      }

/**
 * Оформление заказа клиентом
 * Выводит сообщение об успехе или провале операции
 */
const confirmOperation=()=>{
if(cart&& address){
  try{
    submitOrder(cart.totalPrice, address);

  setOpenConfirm(false);
  setSnackbarMessage('Заказ оформлен');
  setTypeInfo('success');
  setSnackbarOpen(true);
  }
  catch(err){
    setSnackbarMessage((err as Error).message);
    setTypeInfo('error');
    setSnackbarOpen(true);

  }
}
}

/**
 * Возвращает названия всех ингредиентов, которые были добавлены в пиццу клиентом
 * @param ingredientIds - идентификаторы доабвленных ингредиентов
 * @returns {string} - названия всех ингердиентов через запятую
 */
const getAddedIngredients = (ingredientIds: number[]) => {
  return ingredientIds
    .map(id => ingredients.find(i => i.id === id)?.name)
    .filter(Boolean)
    .join(', ');
};


const handleAddToCart = () => {
  if(!!selectedSize&& !!selectedQuantity && !!selectedPizza&&!!selectedIngredientIds&&!!cart&&!!selectedItemId){console.log('Добавлено в корзину:', {
    pizza: selectedPizza,
    size:selectedSize,
    quantity:selectedQuantity,
    ingrIds:selectedIngredientIds
  });
  const newOrderItem:NewOrderItem={
    id:selectedItemId,
    cartId:cart.id,
  addedIngredientIds:selectedIngredientIds,
  
  quantity:selectedQuantity,
  pizzaSizeId:selectedSize,
  
  pizzaId:selectedPizza.id,
  
  };
  updateCartItem(selectedItemId, newOrderItem);

}

}


  
  const CartItemsList=(
    <Box sx={{display: 'flex',
        flexDirection: 'column',
        height: '100vh',       
        width: 350,
        bgcolor: 'whitesmoke'
      }}
    >
    <Box sx={{ flex:1, overflowY:"auto", width: 350, bgcolor:"whitesmoke" }} role="presentation">
      <List sx={{width:'100%', maxWidth:350 }}>
        {cart?.items.map((orderItem) => {
          // const sizeName = getSizeName(orderItem.pizzaSizeId);
          const sizeName = orderItem.pizzaSize;
          const ingredientList = getAddedIngredients(orderItem.addedIngredientIds);
          return (
          <ListItem key={orderItem.id} disablePadding>
            <ErrorBoundary fallback={<div> Ошибка загрузки позиции. </div>}>
            <CartItemCard
            orderItem={orderItem}
            sizeName={sizeName}
            ingredientList={ingredientList}
            onRemove={removeFromCart}
            onEdit={(item:OrderItem)=>{
              const currentPizza = pizzas.find(p => p.id === item.pizzaId);
                  if (currentPizza) {
                    setSelectedPizza(currentPizza);
                    setSelectedSize(item.pizzaSizeId);
                    setSelectedItemId(item.id);
                    setEditingItem(item);
                    setEditing(true);
                  }
            }}
            onQuantityChange={(itemId:number, newQuantity:number)=>{
              const item = cart.items.find(i => i.id === itemId);
                  if (item && cart) {
                    const updatedCartItem: NewOrderItem = {
                      ...item,
                      cartId:cart.id,
                      quantity: newQuantity,
                    };
                    updateCartItem(itemId, updatedCartItem);
                  }
            }}/>
            </ErrorBoundary>
          </ListItem>
        )}
        )}
      </List>
      </Box>
      <Divider />
<Box sx={{bgcolor:"white", position:"sticky", boxShadow: '0 -2px 4px rgba(0,0,0,0.1)' }}>
    <Typography marginLeft={"7px"} marginTop={"7px"} variant="h6">Итого: {cart?.totalPrice.toFixed(2)} ₽</Typography>
    <Button variant="contained" style={{marginTop:16, marginLeft:7, marginBottom:7}} onClick={handleClickOpen} disabled={!cart?.totalPrice||cart?.totalPrice<=0}>
        Оформить заказ
    </Button>
</Box>
    

    </Box>
  );

  return (
<div>

    <Drawer anchor="right" open={open} onClose={onClose}>

{CartItemsList}

    </Drawer>
    <PizzaDialog
        open={editing}
        onClose={()=>{
          setSelectedPizza(null);
          setEditingItem(null);
          setSelectedItemId(0);
        }}
        onAddToCart={handleAddToCart}
        addingNewPizzaMode={false}
        initialData={editingItem}/>
        <Dialog
        open={openConfirm}
       
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Вы действительно хотите оформить заказ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText component="div" id="alert-dialog-slide-description">
            <Typography gutterBottom>
            Стоимость заказа: {cart?.totalPrice} ₽
              </Typography>
            
 <TextField
            required
            fullWidth
            margin="normal"
            id="outlined-required"
            label="Адрес доставки"
            defaultValue={address ?? ""}
            onChange={(e)=>setAddress(e.target.value)}
            error={!address}
            helperText={!address? "Поле обязательно для заполнения":""}
            InputLabelProps={{
              shrink: true
            }}
            />
           
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отменить</Button>
          <Button onClick={confirmOperation} disabled={!address}>Подтвердить</Button>
        </DialogActions>
      </Dialog>
</div>
  )
}
export default CartPanel


