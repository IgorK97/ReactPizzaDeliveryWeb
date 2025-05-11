import HistoryItem from "./HistoryItem";


/**
 * Статусы заказа
 */
export enum OrderStatusEnum{
    NotPlaced = 1,
    IsBeignFormed = 2,
    IsBeingPrepared=3,
    IsBeingTransferred=4,
    HasBeenTransferred=5,
    IsCancelled=6,
    IsDelivered=7,
    IsNotDelivered=8
}

/**
 * Модель заказа
 */
export default interface HistoryOrder{
    id:number;
    price:number;
    status: string;
    statusId:OrderStatusEnum;
    orderTime:string;
    clientId:string;
    courierId:string;
    acceptedTime:string|null;
    deliveryStartTime:string|null;
    completionTime:string|null;
    endCookingTime:string|null;
    cancellationTime:string|null;
    address:string|null;
    isCancelled:boolean;
    isDelivered:boolean;
    orderLines:HistoryItem[]
}
