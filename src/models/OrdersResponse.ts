import HistoryOrder from "./HistoryOrder";

/**
 * Ответ API с заказами с применением пагинации
 */
export interface OrdersResponse {
    items: HistoryOrder[];
    lastId: number;
    hasMore: boolean;
  }