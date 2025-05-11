import { PizzaSize, PizzaSizeEnum } from "./pizza"

/**
 * Элемент заказа
 */
export interface OrderItem{
    id : number;
    pizzaId : number;
    pizzaName : string;
    pizzaImage:string;
    pizzaSize : PizzaSize;
    pizzaSizeId : PizzaSizeEnum;
    itemPrice:number;
    itemWeight:number;
    quantity : number;
    defaultIngredientIds : number[],
    addedIngredientIds : number[]
}