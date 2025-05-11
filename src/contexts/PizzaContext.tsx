import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from "react"
import { Pizza, PizzaSizeEnum } from "../models/pizza"
import { NewPizza } from "../models/NewPizza"
import { Ingredient } from "../models/ingredient"
import { OrderItem } from "../models/OrderItem"
import { PizzaSize } from "../models/pizza"
import { Cart } from "../models/Cart"
import { NewOrderItem } from "../models/NewOrderItem"
import { LoginResponse } from "../models/auth.models"
import { AuthContext } from "./AuthContext"
import { useAuth } from "./AuthContext"
import SubmitOrder from "../models/SubmitOrder"
import { NewIngredient } from "../models/NewIngredient"
import HistoryOrder from "../models/HistoryOrder"
import { UserRole } from "../models/UserRole"
import orderService from "../services/OrderService"
import ingredientService from "../services/IngredientService"
import pizzaService from "../services/PizzaService"
import cartService from "../services/CartService"
import deliveryService from "../services/DeliveryService"
import { formatDateForInput } from "../pathUtils/dateHelper"

/**
 * Интрефейс контекста пиццерии,
 * описывает все свойства и функции, связанные с сстоянием пицц, заказов,
 * ингредиентов, корзины
 */
interface PizzaContextProps {
  pizzas: Pizza[]
  setPizzas:(pizzas:Pizza[])=>void;
  loadMorePizzas: ()=>Promise<void>
  lastId: number
  hasMore: boolean

  ingredients: Ingredient[]
  setIngredients:(ingrs:Ingredient[])=>void;
  fetchIngredients:()=>Promise<void>;

  orders: HistoryOrder[]
  setOrders:(historyOrders:HistoryOrder[])=>void;
  loadMoreOrders:(filter:number)=>Promise<void>
  lastOrderId:number;
  countOrders:number;
  hasMoreOrders:boolean;
  isLoadingOrders:boolean;

  cartId: number|null
  cart: Cart|null
  setCart:(cart:Cart|null)=>void;
  fetchCart:()=>Promise<void>;

  snackbarOpen:boolean; //открыт ли Snackbar
  setSnackbarOpen:(b:boolean)=>void; //Установить открытие
  snackbarMessage:string; //Сообщение
  setSnackbarMessage:(str:string)=>void; //Установить сообщение
  typeInfo:"error"|"success"|"info"|"warning" //Тип уведомления
  setTypeInfo:(typeInfo:"error"|"success"|"info"|"warning")=>void; //Установить тип уведомления

  isLoading: boolean
  error : string | null

  editPizza:Pizza|null;
  setEditPizza: (pizza: Pizza | null) => void

  currentOrderItem: OrderItem|null;
  setCurrentOrderItem:(item:OrderItem|null)=>void;
  selectedSize:PizzaSizeEnum
  setSelectedSize:(ps: PizzaSizeEnum)=>void
  selectedQuantity:number;
  setSelectedQuantity:(quantity:number)=>void;
  selectedIngredientIds:number[];
  setSelectedIngredientIds:(selectedIngredientIds:number[])=>void;
  selectedPizza:Pizza|null;
  setSelectedPizza:(pizza:Pizza|null)=>void;
  selectedItemId:number;
  setSelectedItemId:(id:number)=>void
}

/**
 * Создание контекста пиццерии с начальными значениями по умолчанию
 * для глобального хранения состояния приложения, связанного
 * с пиццами, ингредиентами, заказами, корзиной, а также с уведомлениями о результате
 * операций
 */
export const PizzaContext = createContext<PizzaContextProps>({
  pizzas: [], 
  setPizzas: () => {}, 
  loadMorePizzas: async () => {}, 
  lastId: 0, 
  hasMore: true, 
  ingredients: [],
  setIngredients: () => {},
  fetchIngredients: async () => {},
  orders: [],
  setOrders: () => {},
  loadMoreOrders: async () => {},
  lastOrderId: 0,
  countOrders: 0,
  hasMoreOrders: true,
  isLoadingOrders: false,
  cartId: null,
  cart: null,
  setCart: () => {},
  fetchCart: async () => {},
  snackbarOpen: false,
  setSnackbarOpen: () => {},
  snackbarMessage: '',
  setSnackbarMessage: () => {},
  typeInfo: "success",
  setTypeInfo: () => {},
  isLoading: false,
  error: null,
  editPizza: null,
  setEditPizza: () => {},
  currentOrderItem: null,
  setCurrentOrderItem: () => {},
  selectedSize: PizzaSizeEnum.Small,
  setSelectedSize: () => {},
  selectedQuantity: 1,
  setSelectedQuantity: () => {},
  selectedIngredientIds: [],
  setSelectedIngredientIds: () => {},
  selectedPizza: null,
  setSelectedPizza: () => {},
  selectedItemId: 0,
  setSelectedItemId: () => {},
})




/**
 * Провайдер PizzaContext, оборачивает приложение и предоставляет состояние, связанное
 * с пиццами
 * @param {ReactNode} children - Дочерние компоненты, которые получают доступ к PizzaContext
 * @returns {JSX.Element} провайдер контекста пиццерии
 */
export const PizzaProvider: React.FC<{ children: ReactNode }>= ({ children }) => {

  const {cartId = null, setCartId=()=>{}, userRole} = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [pizzas, setPizzas] = useState<Pizza[]>([]) // Локальное состояние для всех пицц
  const [ingredients, setIngredients]=useState<Ingredient[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>([]);
  const[selectedPizza, setSelectedPizza]=useState<Pizza|null>(null);
  const [currentOrderItem, setCurrentOrderItem]=useState<OrderItem|null>(null);
  const [selectedSize, setSelectedSize] =useState<PizzaSizeEnum>(PizzaSizeEnum.Small)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const[selectedItemId,setSelectedItemId]=useState<number>(0);
  const [isLoadingOrders, setIsLoadingOrders]=useState<boolean>(false);

  /**
   * получение ингредиентов и их установка
   */
  const fetchIngredients=async()=>{
    const response = await ingredientService.getIngredients();
    setIngredients(response); 
  };

  const[hasMoreOrders, setHasMoreOrders] = useState<boolean>(true);
  const [lastOrderId, setLastOrderId]=useState<number>(0);
  const [orders, setOrders]=useState<HistoryOrder[]>([]);
  const [countOrders, setCountOrders]=useState<number>(0);
  const [editPizza, setEditPizza] = useState<Pizza|null>(null)
const [lastId, setLastid]=useState<number>(0);
const [hasMore, setHasMore]=useState<boolean>(true);
const [isLoading, setIsLoading]=useState(false);
const [error, setError] = useState<string|null>(null);
const pageSize=5;

//Для уведомлений о завершении операций
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [typeInfo, setTypeInfo]=useState<"error"|"success"|"info"|"warning">("success");
/**
 * Загрузка дополнительных пицц (пагинация)
 */
const loadMorePizzas = useCallback(async ()=>{
  if(!hasMore||isLoading) 
    return;
  try{
    setIsLoading(true)
    setError(null)
    const response = await pizzaService.getPizzas(lastId, pageSize)
    const additionalPizzas = response.items;

    setPizzas(prev => [...prev, ...response.items])
    setHasMore(response.hasMore)
    setLastid(response.lastId);
  }

  finally {
    setIsLoading(false)
  }
}, [lastId, hasMore, isLoading]);

/**
 * Загрузка заказов с фильтрацией
 * при осуществлении загрузки форматируем строки с датами
 */
const loadMoreOrders = useCallback(async (filter:number)=>{
  if(!hasMoreOrders || userRole===UserRole.None)
    return;
  try{
    setIsLoadingOrders(true);
    const response = userRole==='manager' ? await orderService.getOrders(filter, lastId, pageSize) : userRole==='client' ? 
    await orderService.getClientOrders(lastId, pageSize) : await orderService.getCourierOrders(filter, lastId, pageSize);
const formattedOrders:HistoryOrder[] = response.items.map(o=>({
  ...o,
  completionTime:o.completionTime? formatDateForInput(o.completionTime):null,
  cancellationTime:o.cancellationTime ? formatDateForInput(o.cancellationTime):null,
  orderTime:formatDateForInput(o.orderTime),
acceptedTime:o.acceptedTime?formatDateForInput(o.acceptedTime):null,
 endCookingTime:o.endCookingTime?formatDateForInput(o.endCookingTime):null,
 deliveryStartTime:o.deliveryStartTime?formatDateForInput(o.deliveryStartTime):null
}));
    setOrders(formattedOrders);


  }

  finally{
    setIsLoadingOrders(false);
  }
}, [lastOrderId, hasMoreOrders, isLoadingOrders, userRole])


/**
 * Обращение к сервису корзины CartService, получение корзины и обновление состояния
 */
  const fetchCart=async ()=>{
    const data = await cartService.getCart();
    // console.log(data);
    setCart(data);
  }

  return (
    <PizzaContext.Provider value={{ pizzas, ingredients, setIngredients, cartId, 
      // addToCart, 
      editPizza, 
      setEditPizza, fetchIngredients,currentOrderItem, setCurrentOrderItem,

      cart, setPizzas, setCart,
      selectedSize, setSelectedSize, hasMore, isLoading, lastId, 
      error, loadMorePizzas, 

      selectedQuantity, setSelectedQuantity,
      selectedPizza, setSelectedPizza,
      selectedIngredientIds, setSelectedIngredientIds,
      setSnackbarMessage,setSnackbarOpen,
      snackbarMessage, snackbarOpen,
      selectedItemId, setSelectedItemId,

      setTypeInfo,typeInfo,


      countOrders, hasMoreOrders, isLoadingOrders, lastOrderId, loadMoreOrders, orders, setOrders,

      fetchCart
    }}>{children}</PizzaContext.Provider>
  )
}
