import HistoryOrder from "../models/HistoryOrder";
import { OrdersResponse } from "../models/OrdersResponse";
import SubmitOrder from "../models/SubmitOrder";
import SubmitResult from "../models/SubmitResult";
import { authService } from "./AuthService";

/**
 * Класс сервиса для работы с заказами
 */
class OrderService {
      /** базовый URL API, передается при создании экземпляра класса (разный при разработке и публикации)*/
  private baseUrl: string
  
        /**
 * Создает эксземпляр OrderService
 * @param baseUrl - Базовый URL API
 */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl

  }

  /**
   * Метод получения заказов для клиента (пока пагинация для заказов не работает, но для этого есть условия)
   * @param lastId - идентификатор посоеднего отображенного заказа
   * @param pageSize - размер страницы
   * @returns {Promise<OrdersResponse>} ответ с сервера, содержащий заказы, 
   * информацию о наличии неотображенных заказов и последнего id
   */
  async getClientOrders(lastId:number=0,pageSize:number=10):Promise<OrdersResponse>{
      
    const response = await fetch(`${this.baseUrl}/Orders/`,{
      method:"GET",
      headers:{
        "Authorization": `Bearer ${authService.getToken()}`
      },
    });
    if (!response.ok)
      throw new Error(`Ошибка получения заказов для клиента: ${response.status}`);
    return response.json();
  }

  /**
   * Получение заказов для курьера (пагинация для заказов пока не активна)
   * @param filter - значение для отображения заказов по статусу заказа
   * @param lastId - идентификатор последнего отображенного заказа
   * @param pageSize - размер страницы
   * @returns {Promise<OrdersResponse>} Ответ с сервера, содержащий заказы,
   * информацию о наличии неотображенных заказов и id последнего заказа
   */
  async getCourierOrders(filter:number, lastId:number=0,pageSize:number=10):Promise<OrdersResponse>{
 
    const params = new URLSearchParams({
      status:filter.toString()
      
    });
 
    const response = await fetch(`${this.baseUrl}/Orders/courier?${params}`,
    {
      method:"GET",
      headers:{
         Authorization: `Bearer ${authService.getToken()}`
      },
    });
          
    if(!response.ok)
      throw new Error(`Ошибка при получении истории заказов: ${response.status}`);
    const data = await response.json();
    return data;
  }

/**
 * Метод получения заказов с сервера
 * @param filter - значение фильтра
 * @param lastId - последний id отображенного заказа
 * @param pageSize - размер страницы
 * @returns {Promise<OrdersResponse>} Ответ с сервера, содержащий заказы,
 * информацию о наличии неотображенных заказов и id последнего заказа
 */
  async getOrders(filter:number, lastId:number=0, pageSize:number=10):Promise<OrdersResponse>{
         
    const params = new URLSearchParams({
      status:filter.toString()
        
    });
        
    const response = await fetch(`${this.baseUrl}/Orders/manager?${params}`);
            
    if(!response.ok)
      throw new Error(`Ошибка при получении истории заказов: ${response.status}`);
    const data = await response.json();

    return data;
  }

  /**
   * Метод отмены заказа клиентом
   * @param orderId - id заказа
   * @returns {Promise<HistoryOrder>} отмененный заказ с сервера
   */
  async cancelOrder(orderId:number):Promise<HistoryOrder>{
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/cancel`,{
      method:"PATCH",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authService.getToken()}`
      },
      body:JSON.stringify({orderId})
    });
    if(!response.ok)
      throw new Error(`Ошибка при отмене заказа: ${response.status}`);
    return response.json();
  }
          
  /**
   * Метод приема заказа менеджером
   * @param orderId - id заказа
   * @returns {Promise<HistoryIrder>} принятый менеджером заказ
   */
  async acceptOrder(orderId:number):Promise<HistoryOrder>{
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/accept`,{
      method:"PATCH",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authService.getToken()}`
      },
      body:JSON.stringify({orderId})
    });
    if(!response.ok)
      throw new Error(`Ошибка при принятии заказа: ${response.status}`);
        return response.json();
  }
       
  /**
   * метод принятия курьером заказа
   * @param orderId - id принятого к доставке заказа
   * @returns {Promise<HistoryOrder>} Взятый курьером заказ
   */
  async chooseOrder(orderId:number):Promise<HistoryOrder>{
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/choose`, {
      method:"PATCH",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authService.getToken()}`
      },
      body:JSON.stringify({orderId})
    });
    if(!response.ok)
      throw new Error(`Ошибка при принятии заказа: ${response.status}`);
    return response.json();
  }

  /**
   * Метод оформления клиентом заказа
   * @param orderInfo - данные о заказе типа SubmitOrder
   * @returns {Promise<SubmitResult>} данные о результате оформления заказа
   */
  async submitOrder(orderInfo:SubmitOrder):Promise<SubmitResult>{
    const response = await fetch(`${this.baseUrl}/Carts/submit`,{
      method:"POST",
      headers:{"Content-Type":"application/json",
        "Authorization": `Bearer ${authService.getToken()}`
      },
      body:JSON.stringify(orderInfo),
    });
    if(!response.ok)
      throw new Error(`Ошибка при оформлении заказа: ${response.status}`);
    const data:SubmitResult = await response.json();
    return data;
  }
}

let d:string;
if(process.env.NODE_ENV==='development')
  d = '/api';
else 
  d = 'https://localhost:7243/api';


const orderService = new OrderService(d);
export default orderService // Экспортируем инстанс с базовым URL