import React, { useState } from "react"
import { Box } from "@mui/material"
import RegistrModal from "../Layout/RegistrModal"
import { useNavigate } from "react-router-dom"

/**
 * Страница регистрации
 * отобрадает модальное окно для ввода значений при регистрации
 */
const RegistrPage: React.FC = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()


  return (
    <Box>
      <RegistrModal
        open={open} // ередаём состояние open в модальное окно для управления его видимостью.
        onClose={() => {
            setOpen(false);
            navigate("/");
        }} //Передаём функцию onClose, которая закрывает модальное окно, изменяя состояние open на `alse.
      />
    </Box>
  )
}

export default RegistrPage
