import { Ingredient } from "./ingredient";

/**
 * Тип размера пиццы
 */
export type PizzaSize = 'Small' | 'Medium' | 'Big'

/**
 * Перечисление размеров пиццы
 */
export enum PizzaSizeEnum{
    Small=1,
    Medium=2,
    Big=3
}

/**
 * Модель пиццы
 */
export interface Pizza {
    id: number;
    name: string;
    description: string;
    isAvailable:boolean;
    image: string
    prices: Record<PizzaSizeEnum,number>;
    weights: Record<PizzaSizeEnum, number>;
    ingredients: Ingredient[];
}