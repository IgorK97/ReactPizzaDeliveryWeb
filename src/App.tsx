import React, {useState} from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { PizzaProvider } from "./contexts/PizzaContext"
import PizzaList from "./components/PageComponents/PizzaList"
import PizzaForm from "./components/PageComponents/PizzaForm"
import PizzaDetails from "./components/PageComponents/PizzaDetails"
import Layout from "./components/Layout/Layout"
import { AuthProvider } from "./contexts/AuthContext"
import {useAuth} from "./contexts/AuthContext"
import LoginPage from "./components/PageComponents/LoginPage"
import RegistrPage from "./components/PageComponents/RegistrPage"
import { ThemeProvider, useColorScheme} from "@mui/material"
import mainTheme from "./themes/MainTheme"
import Assortment from "./components/PageComponents/Assortment"
import CartPanel from "./components/Layout/CartPanel"
import IngredientForm from "./components/PageComponents/IngredientForm"
import IngredientManagerList from "./components/PageComponents/IngredientManagerList"
import IngredientDetails from "./components/PageComponents/IngredientDetails"
import OrderHistory from "./components/PageComponents/OrderHistory"
import OrderDetails from "./components/PageComponents/OrderDetails"
import ManagerOrders from "./components/PageComponents/ManagerOrders"
import CourierOrders from "./components/PageComponents/CourierOrders"
import ErrorBoundary from "./errorHandling/ErrorBoundary"

/**
 * Компонент маршрута, защищенного правами доступа пользователя
 * Показывает дочерний компонент children, если у пользователя достаточно прав
 * Иначе отображает сообщение об ошибке и перенаправляет на главную страницу
 * @param {React.ReactElement} children - Дочерний компонент, который должен быть защищён
 * @param {boolean} [adminOnly=false] - Если true, доступ разрешён только администраторам
 * @param {boolean} [managerOnly=false] - Если true, доступ разрешён только менеджерам
 * @param {boolean} [courierOnly=false] - Если true, доступ разрешён только курьерам
 * 
 * @returns {React.ReactElement} - Дочерний компонент или компонент перенаправления.
 */
const ProtectedRoute:React.FC<{children:React.ReactElement;adminOnly?:boolean; managerOnly?:boolean; courierOnly?:boolean}>=({
  children,
  adminOnly=false,
  managerOnly=false,
  courierOnly=false
})=>{
  const { user, isAdmin, isManager, isCourier } = useAuth() //Хук из контекста авторизации, чтобы получить данные о текущем пользователе и его правах

  if (!user) {
    alert("Недостаточно прав. Выполните вход!") //Если пользователь не авторизован, показываем уведомление.
    return <Navigate to="/" replace />//Перенаправляем на главную страницу.
  } else if (adminOnly && !isAdmin) {
    alert("Недостаточно прав пользователя!")
    //Если маршрут только для администраторов, а пользователь не администратор, показываем уведомление.
    return <Navigate to="/" replace />
    //Перенаправляем на главную страницу.
}
else if(managerOnly && !isManager){
  alert("Недостаточно прав пользователя!");
  return <Navigate to="/" replace/>
}
else if(courierOnly && !isCourier){
  alert("Нет доступа");
  return <Navigate to="/" replace/>
}
return children
}

/**
 * Главный компонент приложения
 * Оборачивает приложение в провайдеры тем, контекста авторизации и данных о пиццах, ингредиентах и заказах
 * Определяет маршруты приложения
 */
const App: React.FC = () => {
  return (

    <ThemeProvider theme={mainTheme}>
      <ErrorBoundary fallback={<h2>Что-то пошло не так... Пожалуйста, попробуйте позже</h2>}>
      <AuthProvider>
        <PizzaProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Assortment />} />
            
              <Route path="/history" element={<OrderHistory />} />

              <Route path="/login" element={<LoginPage />} />

              <Route path="/registration" element={<RegistrPage />}/>

              <Route path="/pizzas" element={
                  <ProtectedRoute adminOnly>
                    <PizzaList />
                  </ProtectedRoute>
                } />
                <Route path="/managerorders" element={
                  <ProtectedRoute managerOnly>
                    <ManagerOrders/>
                  </ProtectedRoute>
                }/>
                <Route path="/deliveries" element={
                  <ProtectedRoute courierOnly>
                    <CourierOrders/>
                  </ProtectedRoute>
                }/>
                <Route path="/ingredients" element={
                  <ProtectedRoute managerOnly>
                    <IngredientManagerList />
                  </ProtectedRoute>
                } />
              <Route 
                path="/pizzas/add" 
                element={
                  <ProtectedRoute managerOnly>
                    <PizzaForm />
                  </ProtectedRoute>
                } />
                <Route 
                path="/ingredients/add" 
                element={
                  <ProtectedRoute managerOnly>
                    <IngredientForm />
                  </ProtectedRoute>
                } /> 
                
              <Route path="/pizzas/:id" element={
                <ProtectedRoute managerOnly>
                  <PizzaDetails />
                  </ProtectedRoute>} /> 
                  <Route path="/ingredients/:id" element={
                <ProtectedRoute managerOnly>
                  <IngredientDetails />
                  </ProtectedRoute>} /> 
            </Routes>
          </Layout>
        </PizzaProvider>
      
      </AuthProvider>
      </ErrorBoundary>
     </ThemeProvider>
    
  )
}

export default App