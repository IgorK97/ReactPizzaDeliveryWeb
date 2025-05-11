
/**
 * Данные для создания нового ингредиента
 */
export interface NewIngredient {
    name: string;
    description: string;
    isAvailable:boolean;
    image: string | null;
    pricePerGram: number;
    small:number;
    medium:number;
    big:number;
  }