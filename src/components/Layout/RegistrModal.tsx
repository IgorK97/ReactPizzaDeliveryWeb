import React, { useState, useEffect } from "react"
import { Modal, Box, Typography, TextField, Button, Stack, CircularProgress } from "@mui/material"
// Импорт компонентов из Material UI для создания пользовательского интерфейса.
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { RegisterRequest } from "../../models/auth.models"

/**
 * интерфейс для хранения ошибок формы
 * (для каждого поля формы обязательного для заполнения будет определена своя возможная ошибка)
 */
interface FormErrors {
    firstName?: string;
    lastName?: string;
    userName?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?:string;
    emailAddress?:string;
  }

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto", 
  '&::-webkit-scrollbar': {
    width: '12px',
    backgroundColor: '#2c2c2c',
  },
  '&::-webkit-scrollbar-track':{
    borderRadius:'6px',
    margin:'2px',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '6px',
    border:'3px solid transparent',
    backgroundClip:'content-box',
    backgroundColor: '#9f9f9f',
    '&:hover': {
      backgroundColor: '#d1d1d1',
    }
  },
}

/**
 * интерфейс дял типизации пропсов для RegistrModal
 */
interface RegistrModalProps {
  open: boolean
  onClose: () => void
}

const RegistrModal: React.FC<RegistrModalProps> = ({ open, onClose }) => {
  const { register } = useAuth();

  const navigate = useNavigate();

  //Локальные состояния для храненя информации о пользователе
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const newErrors = {...errors};
    
    newErrors.firstName = !firstName.trim() ? 'Обязательное поле' : '';
    newErrors.lastName = !lastName.trim() ? 'Обязательное поле' : '';
    if (userName.length < 4) {
      newErrors.userName = 'Минимум 4 символа';
    }
    else if (!/^[a-zA-Z0-9_-]+$/.test(userName)) {
      newErrors.userName = 'Только латиница, цифры, _ и -';
    } else {
      newErrors.userName = '';
    }
    newErrors.password = password.length < 8 ? 'Минимум 8 символов' : '';

    newErrors.confirmPassword=confirmPassword!==password? 'Пароли не совпадают':'';


    const allowedChars = /^[\d+\-\s]+$/;

    if (!allowedChars.test(phoneNumber)) {
      newErrors.phoneNumber = 'Разрешены только цифры, +, - и пробелы';
    } else {
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      if (digitsOnly.length < 6) {
        newErrors.phoneNumber = 'Слишком короткий номер';
      } else {
        newErrors.phoneNumber = '';
      }
    }

    if (emailAddress.trim() && (!emailAddress.includes('@') || !emailAddress.includes('.'))) {
      newErrors.emailAddress = 'Неверный формат email';
    } else {
      newErrors.emailAddress = '';
    }
    setErrors(newErrors);
    let isFormValid = true;

    if(newErrors.emailAddress || newErrors.confirmPassword ||
      newErrors.firstName || newErrors.lastName || newErrors.password
      || newErrors.phoneNumber || newErrors.userName
    )
      isFormValid=false;

    setIsValid(isFormValid);
    setErrors(newErrors);
  }, [firstName, lastName, userName, password, confirmPassword, phoneNumber, emailAddress]);

  /**
   * обработка отправки формы
   * @param e - событие отправки формы
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError("")
    setIsLoading(true)

    try {
    
    const regModel : RegisterRequest ={
        userName:userName,
        password:password,
        firstName:firstName,
lastName:lastName,
surname:surname,
address:address,
phoneNumber:phoneNumber,
emailAddress:emailAddress
    };
    await register(regModel);

      onClose()
      navigate("/")
    } catch (err) {
      setError(`Регистрация не удалась: ${err}`) 
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" mb={3}>
          Регистрация
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              placeholder="Имя"
              error={!!errors.firstName}
              helperText={errors.firstName}
              required

            />
            <TextField
              label="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              placeholder="Фамилия"
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
            />
            <TextField
              label="Отчество"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Отчество"
              fullWidth
            />
            <TextField
            label="Адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Адрес"
            fullWidth
          />
            <TextField
              label="Имя пользователя"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              error={!!errors.userName}
              helperText={errors.userName}
              fullWidth
            />

            <TextField
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
            />
            <TextField
              label="Повторите пароль"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              helperText={errors.confirmPassword}
              error={!!errors.confirmPassword}
              fullWidth
            />

            <TextField
              label="Номер телефона"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              fullWidth
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />

            <TextField
              label="Email (необязательно)"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              fullWidth
              error={!!errors.emailAddress}
              helperText={errors.emailAddress}
            />

            {error && <Typography color="error">{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !isValid}
              endIcon={isLoading ? <CircularProgress size={20} /> : null}
              fullWidth
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export default RegistrModal
