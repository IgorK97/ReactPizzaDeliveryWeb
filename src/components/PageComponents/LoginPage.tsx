import React, { useState } from "react"
import { Box } from "@mui/material"
import LoginModal from "../Layout/LoginModal"
import { useNavigate } from "react-router-dom"

/**
 * Страница входа в приложение
 */
const LoginPage: React.FC = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate();
  //Локальное состояние `open` управляет отображением модального окна.
  //Изначально окно отображается (`true`).

  return (
    <Box>
      <LoginModal
        open={open} //Передаём состояние `open` в модальное окно для управления его видимостью.
        onClose={() => {
          setOpen(false);
          navigate("/");
        }} //Передаём функцию `onClose`, которая закрывает модальное окно, изменяя состояние `open` на `false`.
      />
    </Box>
  )
}

export default LoginPage
