import { LoginRequest, LoginResponse, RegisterRequest } from "../models/auth.models"

/**сервис для работы с аутентификацией, авторизацией и регистрацией */
class AuthService {

    /** базовый URL API, передается при создании экземпляра класса (разный при разработке и публикации)*/
  private baseUrl: string

  /** ключ для хранения токена в localStorage*/
  private tokenKey = "jwtToken"


/**
 * Создает эксземпляр AuthService
 * @param baseUrl - Базовый URL API
 */
  constructor(baseUrl: string) {
    this.baseUrl=baseUrl;
  }

/**
 * Выполнение входа пользователя
 * @param credentials - Объект LoginRequest с данными для входа
 * @returns {Promise<LoginResponse>} ответ с сервера с данными об аутентификации
 */
  async login(credentials: LoginRequest): Promise<LoginResponse> {

    const response = await fetch(`${this.baseUrl}/Account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),

    });

    if (!response.ok) {
      throw new Error(`Ошибка при входе: ${response.status}, ${await response.text()}`);


    }

    return (await response.json()) as LoginResponse;


  }

  /**
   * регистрирует нового пользователя
   * @param credentials - параметр типа RegisterRequest, содержащий информацию о регистрации
   * @returns {Promise<LoginResponse>} Ответ с сервера с данными регистрации
   * Так как при регистрации сразу же осуществляется вход, то возвращаются именно эти данные
   */
  async register(credentials : RegisterRequest) : Promise<LoginResponse>{
    const response = await fetch(`${this.baseUrl}/Account/register`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(credentials),
    });
    if(!response.ok){
      throw new Error(`Ошибка при регистрации: ${response.status}, ${await response.text()}`);

    }
    return (await response.json()) as LoginResponse;
  }

/**
 * Сохраняет JWT-токен в localStorage
 * @param token - JWT-токен для сохранения
 */
  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token)
  }

/**
 * Получает сохраненный JWT-токен из localStorage
 * @returns {string | null} токен или null, если его нет
 */
  getToken(): string | null {
    // Метод для получения токена из `localStorage`.
    
    return localStorage.getItem(this.tokenKey)
  }

/**
 * Удаляет токен из localStorage
 */
  removeToken(): void {

    localStorage.removeItem(this.tokenKey)
  }

/**
 * Метод, проверяющий наличие токена аутентификации
 * @returns {boolean} true, если токен есть, иначе вернет false
 */
  isAuthenticated(): boolean {

    return !!this.getToken()

  }

/**
 * Метод для выхода пользователя
 * @returns {Promise<boolean>} true, если успешный выход
 */
  async logout ():Promise<boolean>{
    
    const response = await fetch(`${this.baseUrl}/Account/logout`,{
      method:"POST",
      headers:{

        "Authorization": `Bearer ${authService.getToken()}`
      }

    });
    if(!response.ok){
      return false;
    }
    return true;
  }
  
  /**
   * Метод проверки валидности токена на сервере
   * @returns {Promise<boolean>} true, если токен валиден
   */
  async validateToken():Promise<boolean>{
    const token = this.getToken();

    if (!token) return false;
  
    try {
      const res = await fetch(`${this.baseUrl}/Account/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) 
        return false;
  
      await res.json();
      return true;
    } catch (err) {
      return false;
    }
  }
}
let d:string;
if(process.env.NODE_ENV==='development')
  d = '/api'; 
else 
  d = 'https://localhost:7243/api';
/**
 * Экспорт эксземпляра AuthService с настройкой базового URL
 */
export const authService = new AuthService(d)
