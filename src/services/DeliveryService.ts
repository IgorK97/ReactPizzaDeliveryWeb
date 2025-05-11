import HistoryOrder from "../models/HistoryOrder";
import { authService } from "./AuthService";
/**
 * Класс сервиса по работе с доставками
 */
class DeliveryService {
    /** базовый URL API, передается при создании экземпляра класса (разный при разработке и публикации)*/

  private baseUrl: string
  
    /**
 * Создает эксземпляр DeliveryService
 * @param baseUrl - Базовый URL API
 */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl

  }

  /**
   * Метод завершения доставки курьером
   * @param orderId - идентификатор доставленного (не доставленного) заказа
   * @param status - новый статус
   * @param comment - комментарий
   * @returns {Promise<HistoryOrder>} Заказ HistoryOrder с сервера
   */
  async completeDelivery(orderId:number, status:boolean, comment:string):Promise<HistoryOrder>{
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/complete`, {
      method:"PATCH",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authService.getToken()}`
      },
      body:JSON.stringify({orderId, status, comment})
    });
    console.log(response);
    if(!response.ok)
      throw new Error(`Ошибка при завершении заказа: ${response.status}`);
    const data = response.json();
    console.log(data);
    return data;
  }
    
  /**
   * Метод перевода заказа в состояние ожидающего курьера
   * @param orderId - идентификатор заказа
   * @returns {Promise<HistoryOrder>} Объект HistoryOrder
   */
  async transferToDelivery(orderId:number):Promise<HistoryOrder>{
    console.log("KUKU");
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/to-delivery`,{
      method:"PATCH",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authService.getToken()}`
      },
      body:JSON.stringify({orderId})
    
    });
    if(!response.ok)
      throw new Error(`Ошибка при передаче заказа в доставку: ${response.status}`);
    return response.json();
  }

}

let d:string;
if(process.env.NODE_ENV==='development')
  d = '/api';
else 
  d = 'https://localhost:7243/api';

const deliveryService = new DeliveryService(d);
export default deliveryService // Экспортируем инстанс с базовым URL