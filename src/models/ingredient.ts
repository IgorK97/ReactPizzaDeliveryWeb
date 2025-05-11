
/**
 * Модель ингредиента
 */
export interface Ingredient {
    id: number;
    name: string;
    description: string;
    isAvailable:boolean;
    image: string;
    pricePerGram: number;
    small:number;
    medium:number;
    big:number;
}