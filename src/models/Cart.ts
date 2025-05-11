// models/cart.ts
import { OrderItem } from "./OrderItem";

/**
 * Модель корзины
 */
export interface Cart {
  id: number;           
  userId: number;         
  address:string;
  items: OrderItem[];     
  totalPrice: number;   
  totalWeight: number;
}

