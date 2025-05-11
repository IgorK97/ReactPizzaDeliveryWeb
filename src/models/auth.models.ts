/**
 * Модель для запроса на вход
 */
export interface LoginRequest {
    userName: string
    password: string
  }
  
/**
 * Модель для ответа на запрос о входе
 */
  export interface LoginResponse {
    token: string;
    userId: string;
    userName: string;
    userRole: string;
    cartId:number;
    address:string|null;
  }
  
/**
 * Модель для запроса на регистрацию
 */
export interface RegisterRequest{
  userName : string;
  password : string;
  firstName : string;
  lastName : string;
  surname : string;
  address : string;
  phoneNumber : string;
  emailAddress:string;
}