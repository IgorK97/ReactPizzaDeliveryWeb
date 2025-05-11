import { Pizza } from "./pizza";

/**
 * Ответ API со списком пицц с применением пагинации
 */
export interface PizzasResponse {
    items: Pizza[];
    lastId: number;
    hasMore: boolean;
  }