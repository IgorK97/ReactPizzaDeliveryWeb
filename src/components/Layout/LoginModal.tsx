import React, { useState } from "react"
import { Modal, Box, Typography, TextField, Button, Stack, CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { UserRole } from "../../models/UserRole"

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
}

/**
 * Интрефейс для типизации пропсов loginModal
 */
interface LoginModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Модальное окно входа
 * @param {LoginModalProps} props - пропсы, open - открыто ли окно (true, если открыто), onClose - действие при закрытии
 * @returns 
 */
const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { login, userRole } = useAuth()

  const navigate = useNavigate()

  const [userName, setUserName] = useState("") //Локальное состояние для хранения имени пользователя.
  const [password, setPassword] = useState("") //Локальное состояние для хранения пароля.
  const [error, setError] = useState("") //Локальное состояние для хранения сообщений об ошибке.
  const [isLoading, setIsLoading] = useState(false) //Локальное состояние для управления индикатором загрузки.

  const handleSubmit = async (e: React.FormEvent) => { //Функция обработки отправки формы.
    e.preventDefault() 

    setError("") //Сбрасываем сообщения об ошибках.
    setIsLoading(true) //Включаем индикатор загрузки.

    try {
      await login(userName, password)

      onClose()
      if(userRole===UserRole.Client)
        navigate("/") //Перенаправляем клиента на главную страницу.
      else if(userRole===UserRole.Courier)
        navigate("/deliveries")
      else if(userRole===UserRole.Manager)
        navigate("/pizzas")
      else
      navigate("/")
    } catch (err) {
      setError("Вход не выполнен") //Устанавливаем сообщение об ошибке при неудачном входе.
    } finally {
      setIsLoading(false) //Выключаем индикатор загрузки.
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" mb={3}>
          Вход в систему
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Имя пользователя"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} //Обновляем имя пользователя
              required
              fullWidth
            />

            <TextField
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} //Обновляем пароль
              required
              fullWidth
            />

            {error && <Typography color="error">{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={20} /> : null}
              fullWidth
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export default LoginModal
