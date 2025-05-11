import { Cart } from "./Cart";

/**
 * Результат с сервера после оформления заказа
 */
export default interface SubmitResult{
    success:boolean;
    message:string;
    updatedCart:Cart;
}