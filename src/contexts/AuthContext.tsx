import React, { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/AuthService"
import { LoginResponse, RegisterRequest } from "../models/auth.models"
import { UserRole } from "../models/UserRole"

/**
 * Интерфейс контекста аутентификации, авторизации, регистрации
 */
interface AuthContextType {
  user: LoginResponse | null
  cartId : number|null
  address:string|null;
  setAddress:(str:string|null)=>void;
  setCartId:(cartId:number)=>void
  login: (userName: string, password: string) => Promise<void>
  logout: () => void
  register:(regModel : RegisterRequest)=> Promise<void>
  isAdmin: boolean
  isManager:boolean;
  isCourier:boolean;
  userRole:UserRole;
  isAuthReady:boolean;
  setUserRole:(role:UserRole)=>void;
}

/**
 * Создание контекста аутентификации
 */

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 *  Провайдер контекста аутентификации,
 * предоставляет данные о пользователе и методы авторизации, регистрации
 * @param param0
 * @returns 
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


  const [user, setUser] = useState<LoginResponse | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [cartId, setCartId] = useState<number|null>(null);
  const [address, setAddress]=useState<string|null>(null);
  const [userRole,setUserRole]=useState<UserRole>(UserRole.None);

  /**
   * Эффект инициализации аутентификации
   * Проводит проыерку существования токена и его валидацию
   * При успехе получает из localStorage пользователя и его роли.
   */
  useEffect(() => {
    const checkAuth = async()=>{
      const token = authService.getToken()
    if (token) {

      const storedUser = localStorage.getItem("user")

      if (storedUser) {
        const result = await authService.validateToken();
        if(!result){
          authService.removeToken()

      
          localStorage.removeItem("user")

          setUser(null);
          setUserRole(UserRole.None);
        }
        else{
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setCartId(userData.cartId);
          switch(userData.userRole?.toLowerCase()) {
            case 'manager': 
              setUserRole(UserRole.Manager);
              break;
            case 'courier':
              setUserRole(UserRole.Courier);
              break;
            case 'client':
              setUserRole(UserRole.Client);
              break;
            case 'admin':
              setUserRole(UserRole.Admin);
              break;
            default:
              setUserRole(UserRole.None);
          }
        }
     
      }
      
    }
    setIsAuthReady(true);
  }
  checkAuth();
  }, [])


/**
 * Вход пользователя
 * @param userName - логин
 * @param password - пароль
 */
  const login = async (userName: string, password: string) => {

      const response = await authService.login({ userName, password })
      authService.storeToken(response.token)

      localStorage.setItem("user", JSON.stringify(response));

      setUser(response)
      //Если это клиент, то дял него нужно достать корзину
      if(response.userRole==="client"){
        setCartId(response.cartId);

        setAddress(response.address);
        setUserRole(UserRole.Client);
      }
      else{
        setCartId(null);
        setAddress(null);
        if(response.userRole==="manager")
          setUserRole(UserRole.Manager);
        else if(response.userRole==="courier")
          setUserRole(UserRole.Courier);
        else if(response.userRole==="admin")
          setUserRole(UserRole.Admin);
      }

  }

  /**
   * Регистрация нового пользователя
   * @param regModel - данные для регистрации типа RegisterRequest
   */
  const register = async (regModel : RegisterRequest)=>{
      const response = await authService.register(regModel);
      authService.storeToken(response.token);
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
      setCartId(response.cartId);
      setAddress(response.address);
      setUserRole(UserRole.Client);
  }

  /**
   * Выход из системы и удаление токена из localStorage
   */
  const logout = async () => {
    const res = await authService.logout();

    if(res){
      authService.removeToken()


    localStorage.removeItem("user")

    setUser(null);
    setUserRole(UserRole.None);
    }

  }

//Определение роли пользователя
  const isAdmin = user?.userRole === UserRole.Manager
  const isManager = user?.userRole===UserRole.Manager
  const isCourier=user?.userRole===UserRole.Courier


  return (
    <AuthContext.Provider value={{ user, cartId, 
    setCartId, login, logout, register, isAuthReady, 
    isAdmin, isManager, isCourier, address, userRole, 
    setUserRole, setAddress }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Хук для доступа к контексту аутентификации
 * @returns {AuthContextType} Контекст аутентификации
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth должен быть использован внутри AuthProvider")
  }
  return context
}
