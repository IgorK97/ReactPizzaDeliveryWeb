import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Stack, Box, Snackbar, Alert } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useColorScheme } from "@mui/material"
import Tooltip from "@mui/material/Tooltip"
import {Brightness7, Brightness4, Storefront, Settings, ShoppingBasket, ReceiptLong, AccountBox, Inbox, AddToQueue} from "@mui/icons-material"
import CartPanel from "./CartPanel"
import { useContext, useEffect, useState } from "react"
import { PizzaContext } from "../../contexts/PizzaContext"
import { UserRole } from "../../models/UserRole"
import { LoginResponse } from "../../models/auth.models"

interface HeaderProps {
  onMenuItemClick: (path: string) => void
  // Пропс отвечает за обработку кликов по элементам меню.
}

const MENU_ITEMS = [
  // Массив с настройками пунктов меню: текст, иконка и путь.
  // { text: "Домашняя", icon: <Home />, path: "/" },
  { text: "Ассортимент", icon: <Storefront/>, path: "/", type:UserRole.Client },
  { text: "Настройка пицц", icon: <Settings />, path: "/pizzas", type:UserRole.Manager },
  { text: "Настройка ингредиентов", icon: <Settings />, path: "/ingredients", type:UserRole.Manager },

  // {text:"Корзина", icon:<ShoppingBasket/>, path:"/cart", type:"client"},
  {text: "История заказов", icon:<ReceiptLong/>, path:"/history", type:UserRole.Client},
  {text: "Профиль", icon:<AccountBox/>, path:"/profile", type:UserRole.All},
  {text:"Поступившие заказы", icon:<Inbox/>, path:"/managerorders", type:UserRole.Manager },
  {text:"Заказы", icon:<AddToQueue/>, path:"/deliveries", type:UserRole.Courier}
]


const Header: React.FC<HeaderProps> = ({onMenuItemClick}) => {
  const { user, logout, userRole, setUserRole, isAuthReady } = useAuth()
  const { mode, setMode } = useColorScheme();
  const location = useLocation()
  const context = useContext(PizzaContext);
  const {fetchCart=()=>{}, snackbarOpen, snackbarMessage, typeInfo, setSnackbarOpen=()=>{}}=context||{};
  const isDarkMode = mode === 'dark';
  const toggleTheme = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setMode(newMode);
  };
      const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };
  const [openCart, setOpenCart] = useState(false);
  const userData = localStorage.getItem("user");
  useEffect(()=>{
    // if(!isAuthReady)return;
if(!!userData){
      const userInfo:LoginResponse = JSON.parse(userData);
    const role=userInfo.userRole;
    if(role==="client")
      setUserRole(UserRole.Client);
    else if(role==="courier")
      setUserRole(UserRole.Courier);
    else if(role==="manager")
      setUserRole(UserRole.Manager);
    else if(role==="admin")
      setUserRole(UserRole.Admin)
}
else 
  setUserRole(UserRole.None);
  console.log(userRole);
  
  },[]);

  

  
  const navigate = useNavigate()

  return (
  
    <AppBar position="fixed">
      {/* Основной компонент Material UI для создания AppBar (панели заголовка). */}
      <Toolbar>
<Button onClick={()=>navigate("/")}
  sx={{textTransform: 'none', // убирает автоматический uppercase у кнопки
    color: 'inherit', // наследует цвет текста от родителя
    justifyContent: 'flex-start', // выравнивание текста по левому краю
    fontSize: '1.25rem', // соответствует размеру h6
    }}>
  Пиццерия
</Button>
        {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Пиццерия
 
        </Typography> */}
       <Box sx={{
        display:'flex',
        gap:5,
        alignItems:'center',
        mx:2,
        flexGrow:1,
        justifyContent:'center'
       }}>
{/* Перечисляем элементы меню. */}
{MENU_ITEMS.filter(item=>item.type===userRole || (item.type===UserRole.All && userRole!==UserRole.None)).map((item) => (
          <Box
            key={item.text}
            // `key` обязателен для корректного отображения списка React.
            onClick={() => onMenuItemClick(item.path)}
            // При клике вызываем функцию с соответствующим путём.
            sx={{
              backgroundColor:
                location.pathname === item.path ? "background.paper" : "inherit",
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                cursor:'pointer',
              // Подсвечиваем активный элемент меню, если текущий путь совпадает с его путём.
              "&:hover": {
                backgroundColor: "#e0e0e0",
                // Меняем цвет фона элемента меню при наведении.
              },
            }}
          >
            <IconButton>
              
              {item.icon}

              
              </IconButton>
            {/* Отображаем иконку элемента меню. */}
            <Typography variant="caption" sx={{fontSize:'0.75rem'}}>
              {item.text}
              </Typography> 
            {/* Отображаем текст элемента меню. */}
          </Box>
        ))}
       </Box>
       {userRole===UserRole.Client && <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            mr: 2
          }}>
            <IconButton 
              color="inherit"
              onClick={(e)=>{
                e.preventDefault();
                fetchCart();
                setOpenCart(true);
              }}
              aria-label="Корзина"
            >
              <ShoppingBasket />
            </IconButton>
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              Корзина
            </Typography>

          </Box>
}
    {/* <Tooltip title={isDarkMode ? "Светлая тема" : "Тёмная тема"}>

      <IconButton 
        onClick={toggleTheme} 
        color="inherit" 
        aria-label='Сменить тему'
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip> */}
         {user ? (
          // Если пользователь авторизован, отображаем его имя и кнопку выхода.
          <>
          
            <Typography sx={{ mr: 2 }}>
              {user.userName.charAt(0).toUpperCase() + user.userName.slice(1)}
            </Typography>
            {/* Вывод имени пользователя с отступом справа (mr = margin-right). */}
            <IconButton
              onClick={() => {
                // logout()
                // При клике вызываем функцию выхода из системы.
                // navigate("/")
                // Перенаправляем пользователя на главную страницу.
              }}
              color="inherit"   >
              <Avatar sx={{ width: 32, height: 32 }}>
                {/* Компонент Avatar показывает первую букву имени пользователя. */}
                {user.userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Button onClick={()=>{
              navigate('/');
              logout();
            }}
  sx={{textTransform: 'none', // убирает автоматический uppercase у кнопки
    color: 'inherit', // наследует цвет текста от родителя
    justifyContent: 'flex-end', // выравнивание текста по левому краю
    fontSize: '1.25rem', // соответствует размеру h6
    }}>
  Выход
</Button>
          </>
        ) : (
          // Если пользователь не авторизован, отображаем кнопку входа и регистрации
         <Stack direction="row" spacing={2}>
<Button color="inherit" onClick={() => navigate("/login")}>
            Войти
            {/* Кнопка "Войти" перенаправляет на страницу авторизации. */}
          </Button>
          <Button color="inherit" onClick={()=>navigate("/registration")}>
            Зарегистрироваться
          </Button>
         </Stack>
          
        )}
        <CartPanel open={openCart} onClose={()=>setOpenCart(false)}/>
      </Toolbar>
      <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{zIndex:1000}}
          >
            <Alert 
              onClose={handleSnackbarClose} 
              severity={typeInfo}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
    </AppBar>
    
  
  )
}

export default Header
