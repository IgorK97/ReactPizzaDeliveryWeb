import React from "react"
import { Box, CssBaseline } from "@mui/material"
import Header from "./Header"
import { useNavigate } from "react-router-dom"

/**
 * определение интерфейса для пропсов компонента Layout
 */
interface LayoutProps {
  children: React.ReactNode //Вложенные компоненты
}

/**
 * Фукнциональный компонент Layout, который используется для отобрадения основной струткуры приложения
 * @param {LayoutProps} props - пропсы, children - вложенные компоненты
 * @returns 
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {

  const navigate = useNavigate() //Хук useNavigate из react-router-dom используется для программной навигации.

  const handleMenuItemClick = (path: string) => {
    navigate(path) //Функция для обработки кликов по пунктам меню. Принимает путь маршрута и выполняет переход.
  }

  return (
    <Box>
      <CssBaseline />
      {/* CssBaseline отвечает за сброс стандартных стилей браузера. */}
      <Header onMenuItemClick={handleMenuItemClick}/>
      {/* Компонент для отображения шапки приложения. */}
      <Box
        component="main"
        //Основная область страницы, где будет отображаться содержимое `children`.
        sx={{
          flexGrow: 1, // Основной контейнер занимает оставшееся пространство.
          padding: 3, // Отступы внутри основного контейнера.
          marginTop: "64px"
        }}
      >
        {children}
        {/* Вложенные компоненты, которые рендерятся внутри Layout. */}
      </Box>
    </Box>
  )
}

export default Layout
