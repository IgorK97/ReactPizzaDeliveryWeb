import React, { useContext, useState, useEffect, useCallback } from "react";
import { PizzaContext } from "../../contexts/PizzaContext";
import { Link, useNavigate } from "react-router-dom";
// import MyNotification from "../Layout/MyNotification";
import { 
  Button, 
  Grid, 
  Card, 
  CardActionArea, 
  CardMedia, 
  CardContent, 
  Typography, 
  CircularProgress,
  Box,
  Chip,
  Snackbar,
  Alert,
 
} from "@mui/material";
import cartService from "../../services/CartService";

import InfiniteScroll from "react-infinite-scroll-component";
import { ShoppingCartOutlined } from "@ant-design/icons";
import PizzaDialog from "./PizzaDialog";
import { Pizza, PizzaSizeEnum } from "../../models/pizza";
import { OrderItem } from "../../models/OrderItem";
import { NewOrderItem } from "../../models/NewOrderItem";

import { useAuth } from "../../contexts/AuthContext";
import { PizzaCard } from "./PizzaCard";
import ErrorBoundary from "../../errorHandling/ErrorBoundary";

/**
 * Компонент ассортимента пиццерии, где предсатвлены пиццы
 */
const Assortment: React.FC = () => {

  const navigate = useNavigate();
  const { userRole, cartId } = useAuth();
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
   
  // const [snackbarMessage, setSnackbarMessage] = useState('');
  // const [typeInfo, setTypeInfo]=useState<"error"|"success"|"info"|"warning">("success");
//   const [page, setPage] = useState(1);
const context = useContext(PizzaContext);
// const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);

const [selection, setSelection]=useState<boolean>(false);
const [error,setError]=useState<string|null>(null);


  //Загрузка данных при монтировании и изменении страницы
  useEffect(() => {
    const loadData = async ()=>{
      try{
        await loadMorePizzas();
        await fetchIngredients();

      } catch(err){
        // setLocalError(err as Error);
        setError(`Ошибка: ${(err as Error).message}`);
      }
    }

    loadData();
  }, []);
  if (!context) {
    return <div>Ошибка загрузки контекста</div>
  }
  if(error)
    return <div>{error}</div>
  const { 
    pizzas = [], 
    hasMore = false, 
    isLoading = false, 
    lastId = 0,
    setCart,
   
    selectedSize=null,
    selectedQuantity=null,
    selectedIngredientIds=[],
    selectedPizza=null,
    setSnackbarMessage=()=>{},
    setSnackbarOpen=()=>{},
    setTypeInfo=()=>{},
    setSelectedPizza=()=>{},
    loadMorePizzas = () => {},
    // addToCart=()=>{},
    fetchIngredients=()=>{}
  } = context || {};

/**
 * Добавление пиццы 9компонента заказа) в корзину
 * @param item - Новая позиция заказа
 */
  const addToCart = async (item: NewOrderItem)=>{
    // const userInfo = localStorage.getItem("user");
    if(!!cartId){
      // const userData = JSON.parse(userInfo);
      item.cartId=cartId;
      const updatedCart = await cartService.addToCart(item);
      setCart(updatedCart);
      console.log("Получил корзину: ", updatedCart);
      console.log("CartId: ", cartId);
    setSnackbarMessage('Пицца успешно добавлена в корзину!');
      setSnackbarOpen(true);
    }
      }


      /**
       * Обработчик добавления выбранной пиццы в корзину
       */
const handleAddToCart = async () => {
      if(!!selectedSize&& !!selectedQuantity && !!selectedPizza){console.log('Добавлено в корзину:', {
        pizza: selectedPizza,
        size:selectedSize,
        quantity:selectedQuantity,
        ingrIds:selectedIngredientIds
      });
      

    const newOrderItem:NewOrderItem={
      id:0,
      cartId:0,
    addedIngredientIds:selectedIngredientIds,

    quantity:selectedQuantity,
    pizzaSizeId:selectedSize,

    pizzaId:selectedPizza.id,

    };
    await addToCart(newOrderItem);
    }
}
// if(context)
//   throw new Error("Ошибка");
  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Ассортимент</Typography>

      </Box>

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
        <Grid container spacing={3}>
          {pizzas.map((piz) => (
            <ErrorBoundary key={piz.id} fallback={<div>Ошибка загрузки пиццы</div>}>
            <PizzaCard pizza={piz} userRole={userRole} onSelectPizza={(pizza)=>{
              setSelectedPizza(pizza);
              setSelection(true);
            }}
            onNavigateToEdit={(id)=>navigate(`/pizzas/${id}`)}
            />
            </ErrorBoundary>
            
          
          ))}
        </Grid>
      </InfiniteScroll>
      <PizzaDialog
        // pizza={selectedPizza}
        open={selection}
        onClose={()=>{
          setSelectedPizza(null);
          setSelection(false);
        }
        }
        onAddToCart={handleAddToCart}
        addingNewPizzaMode={true}
        initialData={null}/>
    
    </Box>
    
  );
};

export default Assortment;