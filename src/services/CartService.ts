import { Cart } from "../models/Cart";
import { NewOrderItem } from "../models/NewOrderItem";
import { authService } from "./AuthService";


/**
 * Класс сервиса для работы с корзиной
 */
class CartService {

    /** базовый URL API, передается при создании экземпляра класса (разный при разработке и публикации)*/
  private baseUrl: string

  /**
 * Создает эксземпляр CartService
 * @param baseUrl - Базовый URL API
 */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl

  }

/**
 * Асинхронный метод получения корзины с сервера для текущего авторизованного пользователя
 * @returns {Promise<Cart>} ответ с сервера с данными корзины
 */
  async getCart(): Promise<Cart> {
    const response = await fetch(`${this.baseUrl}/Carts/`,{
      headers:{
        "Authorization": `Bearer ${authService.getToken()}`
      },
    });
    if (!response.ok) 
      throw new Error(`Ошибка получения корзины: ${response.status}`);
    return response.json();
  }

  /**
   * Метод добавления позиции заказа в корзину
   * @param orderItem - позиция корзиын (заказа), добавляемая пользователем
   * @returns {Promise<Cart>} Обновленная корзина, полученная с сервера
   */
  async addToCart(orderItem:NewOrderItem): Promise<Cart> {
    orderItem.id=0;
    const response = await fetch(`${this.baseUrl}/Carts/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(orderItem),
    });
    if (!response.ok) 
      throw new Error(`Ошибка добавления в корзину: ${response.status}`);
    return response.json();
  }

  /**
   * Метод обновления компонента корзины
   * @param itemId - идентификатор компонента
   * @param updatedCartItem - новое содержимое компонента
   * @returns {Promise<Cart>} Обновленная корзина, полученная с сервера
   */
  async updateCartItem(itemId:number, updatedCartItem:NewOrderItem):Promise<Cart>{
    const response = await fetch(`${this.baseUrl}/cartitems/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(updatedCartItem)
    });
    if(!response.ok) 
      throw new Error(`Ошибка при изменении позиции в корзине: ${response.status}`);
    return response.json();
  }

  // async updateAddress(address: string): Promise<Cart> {
  //   const response = await fetch(`${this.baseUrl}/address`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${authService.getToken()}`
  //     },
  //     body: JSON.stringify({ address })
  //   });
  //   if(!response.ok) 
  //     throw new Error(`Ошибка при обновлении адреса: ${response.status}`);
  //   return response.json();
  // }


/**
 * Метод удаления из корзины позиции по ее идентификатору
 * @param itemId - идентификатор удаляемой позиции
 * @returns {Promise<Cart>} - Объект корзины с сервера
 */
  async removeFromCart(itemId:number):Promise<Cart>{
    const response = await fetch(`${this.baseUrl}/cartitems/${itemId}`, {
      method: "DELETE",
      headers:{
      
        "Authorization": `Bearer ${authService.getToken()}`
      }
    });
    if(!response.ok){
      throw new Error(`Ошибка при удалении товара из корзины: ${response.status}`);
    }
    return response.json();
  }

}

let d:string;
if(process.env.NODE_ENV==='development')
  d = '/api';
else 
  d = 'https://localhost:7243/api';
const cartService = new CartService(d);
export default cartService // Экспортируем инстанс с базовым URL