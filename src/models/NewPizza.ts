// export interface NewPizza {
//     name: string;
//     description: string;
//     isAvailable:boolean;
//     image: File | null;
    
//   }

/**
 * Данные для создания новой пиццы
 */
export interface NewPizza {
  name: string;
  description: string;
  isAvailable:boolean;
  image: string | null;
  defaultIngredientIds:number[];
}