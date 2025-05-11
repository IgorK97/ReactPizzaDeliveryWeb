import { PizzaSize, PizzaSizeEnum } from "./pizza"

/**
 * Элемент нового заказа
 */
export interface NewOrderItem{
    id : number,
    cartId:number,
    pizzaId : number,
    // pizzaSize : PizzaSize,
    pizzaSizeId:PizzaSizeEnum,
    quantity : number,
    addedIngredientIds : number[]
}