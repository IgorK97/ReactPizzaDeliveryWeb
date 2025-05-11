import { PizzaSizeEnum } from "./pizza";

/**
 * Модель элемента заказа
 */
export default interface HistoryItem{
    id:number;
    pizzaId:number;
    pizzaImage:string;
    pizzaName:string;
    size:string;
    sizeId:PizzaSizeEnum;
    price:number;
    weight:number;
    quantity:number;
    addedIngredients:string[]
}
