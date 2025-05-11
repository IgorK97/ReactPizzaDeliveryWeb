import { NewPizza } from "../models/NewPizza";
import { Pizza } from "../models/pizza";
import { PizzasResponse } from "../models/PizzasResponse";
import { authService } from "./AuthService";


interface updatePizza{
  id:number,
  name: string;
  description: string;
  isAvailable:boolean;
  image: string | null;
  ingredients:number[];
}


class PizzaService {
      /** базовый URL API, передается при создании экземпляра класса (разный при разработке и публикации)*/
  private baseUrl: string
  
    /**
 * Создает эксземпляр PizzaService
 * @param baseUrl - Базовый URL API
 */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl

  }
  /**
   * Метод получения пицц (с реализованной пагинацией)
   * @param lastId - id последней отображенной пиццы
   * @param pageSize - размер страницы
   * @returns {Promise<PizzasResponse>} ответ с сервера с данными о пиццах,
   * о том, есть ли еще не отобраденные пиццы и с id последней пиццы
   */
async getPizzas(lastId: number = 0, pageSize: number = 10): Promise<PizzasResponse> {
  const params = new URLSearchParams({
    lastId:lastId.toString(),
    pageSize:pageSize.toString()
  });
  const response = await fetch(`${this.baseUrl}/Pizzas?${params}`)
    if (!response.ok) 
      throw new Error(`Не удалось запросить пиццы. Статус: ${response.status}`);
    
  const data = await response.json();


  return data;
}

/**
 * Метод создания пиццы
 * @param dataPizza типа NewPizza - создаваемая пиццы
 * @returns {Promise<Pizza>} созданная пицца
 */
async createPizza(dataPizza: NewPizza): Promise<Pizza> {
   

  const response = await fetch(`${this.baseUrl}/Pizzas`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
      "Authorization": `Bearer ${authService.getToken()}`
    },

    body: JSON.stringify(dataPizza),
  })
  if (!response.ok) 
    throw new Error(`Пиццу создать не удалось: ${response.status}`);
  return await response.json();
}


// async getPizza(id:number):Promise<Pizza>{
//   const response = await fetch(`${this.baseUrl}/Pizzas/${id}`)
//   if(!response.ok) 
//     throw new Error(`Не удалось запросить пиццу: response.status}`);
//   return await response.json();
//   }


  /**
   * Метод обновления пиццы
   * @param id - идентификатор обновляемой пиццы
   * @param dataPizza - данные обновляемой пиццы типа NewPizza
   * @returns 
   */
async updatePizza(id: number, dataPizza: NewPizza): Promise<Pizza> {
  
  const updatedPizza :updatePizza={
    id: id,
    name: dataPizza.name,
    description: dataPizza.description,
    isAvailable: dataPizza.isAvailable,
    image:dataPizza.image,
    ingredients:dataPizza.defaultIngredientIds
  };
  const response = await fetch(`${this.baseUrl}/Pizzas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
      "Authorization": `Bearer ${authService.getToken()}`
    },
    body:JSON.stringify(updatedPizza),
  });
  
  if (!response.ok)
    throw new Error(`Эту пиццу обновить не удалось: ${response.status}`);
  return await response.json();
}

/**
 * Метод удаления пиццы
 * @param id - идентификатор удаляемой пиццы
 */
  async deletePizza(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/Pizzas/${id}`, {
      method: "DELETE",
      headers:{
         "Authorization": `Bearer ${authService.getToken()}`
      }
    })
    if (!response.ok) 
      throw new Error(`Эту пиццу удалить не удалось: ${response.status}`);
  }


}

let d:string;
if(process.env.NODE_ENV==='development')
  d = '/api';
else 
  d='https://localhost:7243/api';

const pizzaService = new PizzaService(d);
export default pizzaService // Экспортируем инстанс с базовым URL