import { Ingredient } from "../models/ingredient";
import { NewIngredient } from "../models/NewIngredient";
import { authService } from "./AuthService";

/**
 * Интерфейс для обнолвения ингредиента
 */
interface updateIngredient{
  id:number,
  name: string;
  description: string;
  isAvailable:boolean;
  image: string | null;
  pricePerGram: number;
  small:number;
  medium:number;
  big:number;
}

/**
 * Сервис для работы с ингредиентами
 */
class IngredientService {
    /** базовый URL API, передается при создании экземпляра класса (разный при разработке и публикации)*/
  private baseUrl: string
  
      /**
 * Создает эксземпляр IngredientService
 * @param baseUrl - Базовый URL API
 */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl

  }

  /**
   * Метод получения ингредиентов
   * @returns {Promise<Ingredient[]>} Список ингредиентов
   */
  async getIngredients():Promise<Ingredient[]>{

        const response = await fetch(`${this.baseUrl}/Ingredients`);
      if(!response.ok) 
        throw new Error(`Не удалось запросить ингредиенты: ${response.status}`);
      return await response.json();

  }

  /**
   * Метод создания ингредиента
   * @param dataIngr - новый ингредиент типа NewIngredient
   * @returns {Promise<Ingredient>} - Созданный ингредиент
   */
  async createIngredient(dataIngr:NewIngredient):Promise<Ingredient>{

      const response = await fetch(`${this.baseUrl}/Ingredients`,{
      method:"POST",
      headers:{"Content-Type":"application/json",
        "Authorization":`Bearer ${authService.getToken()}`
      },
      body:JSON.stringify(dataIngr),
      })
      if(!response.ok)
        throw new Error(`Ингредиент создать не удалось: ${response.status}`);
      return await response.json();

  }

  /**
   * Метод обновления ингредиента
   * @param id - идентификатор ингредиента
   * @param dataIngredient - ингредиент типа NewIngredient
   * @returns {Promise<Ingredient>} Обновленный ингредиент
   */
  async updateIngredient(id:number, dataIngredient:NewIngredient):Promise<Ingredient>{

      const updatedIngredient:updateIngredient={
        id:id,
        name:dataIngredient.name,
        description:dataIngredient.description,
        isAvailable:dataIngredient.isAvailable,
        image:dataIngredient.image,
        big:dataIngredient.big,
        medium:dataIngredient.medium,
        small:dataIngredient.small,
        pricePerGram:dataIngredient.pricePerGram
      };
      const response = await fetch(`${this.baseUrl}/Ingredients/${id}`,{
        method:"PUT",
        headers:{ "Content-Type": "application/json",
          "Authorization":`Bearer ${authService.getToken()}`
        },
        body:JSON.stringify(updatedIngredient),
      });
      if(!response.ok)
        throw new Error(`Ингредиент обновить не удалось: ${response.status}`);
      return await response.json();
  
  }

  /**
   * Метод удаления (логического) ингредиента
   * @param id - Идентификатор ингредиента
   */
  async deleteIngredient(id:number):Promise<void>{

      const response=await fetch(`${this.baseUrl}/Ingredients/${id}`,{
        method:"DELETE",
        headers:{"Authorization":`Bearer ${authService.getToken()}`},
      })
      if(!response.ok) 
        throw new Error(`Ингредиент удалить не удалось: ${response.status}`);

  }  
}

let d:string;
if(process.env.NODE_ENV==='development')
  d = '/api';
else 
  d ='https://localhost:7243/api';

const ingredientService = new IngredientService(d);
export default ingredientService
        