import React from "react";
import {
  Card,
  IconButton,
  CardMedia,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Remove, Add, Close } from "@mui/icons-material";
import { OrderItem } from "../../models/OrderItem";
import { IMAGE_BASE_URL } from "../../pathUtils/imagePath";

/**
 * Интерфейс для типизации пропсов, передаваемых компоненту CartItemCard
 */
interface CartItemProps{
    orderItem:OrderItem; //Компонент корзины
    onRemove:(itemId:number)=>void; //Удаление элемента с индексом itemId
    onEdit:(item:OrderItem)=>void; //Редактирование элемента item
    onQuantityChange:(itemId:number, newQuantity:number)=>void; //Изменение количества
    sizeName:string; //Название размера
    ingredientList:string; //Список ингредиентов в виде строки
}

/**
 * Компонент отображения элемента корзины
 * @param {cartItemProps} props - пропсы, определенные в интерфейсе cartItemProps
 */
export const CartItemCard:React.FC<CartItemProps>=({orderItem, onRemove, onEdit, onQuantityChange, sizeName, ingredientList})=>{
    return(
        <Card sx={{ display: 'flex',flexDirection:'column', bgcolor:"white", marginTop:'7px', width:'100%' }}>
        <IconButton 
            sx={{ 
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
              color: 'text.secondary'
            }}
            onClick={()=>onRemove(orderItem.id)}
            aria-label="Удалить"
          >
            <Close fontSize="small" />
          </IconButton>
        <Box sx={{display:'flex', gap:2}}>
            <CardMedia
                component="img"
                sx={{ width: 100, height:100, marginTop:"7px", marginLeft:"7px" }}
                image={`${IMAGE_BASE_URL}${orderItem.pizzaImage}`}
                alt={orderItem.pizzaImage}
              />
              
                <Box sx={{flexGrow:1}}>
                  <Typography component="div" variant="h5">
                   {orderItem.pizzaName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Размер: {sizeName}
                </Typography>
                

                <Typography variant="caption" color="text.disabled">
            {ingredientList || "Без дополнительных ингредиентов"}
          </Typography>


                </Box>
                </Box>
                
              <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
     
              mt: 1,
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
      
              <Typography variant="h6" fontWeight="bold" marginLeft={"7px"}>
               {orderItem.itemPrice.toFixed(2)} ₽
              </Typography>
              <Box sx={{ 
            display: 'flex',
            gap: 2 
          }}>

              <Button 
                variant="outlined" 
                size="small"
                sx={{ mx: 2, marginBottom:"7px" }}
                onClick={()=>onEdit(orderItem)
                

            }
            aria-label="Изменить"
              >
                Изменить
              </Button>
        
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" onClick={()=>
                    onQuantityChange(orderItem.id, orderItem.quantity-1)
                } 
                aria-label="Уменьшить количество"
                    disabled={orderItem.quantity<=1}>
                  <Remove fontSize="small"  />
                </IconButton>
                
                <Typography variant="body1" sx={{ mx: 1 }}>
                  {orderItem.quantity}
                </Typography>
                
                <IconButton size="small" onClick={()=>
                    onQuantityChange(orderItem.id, orderItem.quantity+1)
                    } 
                    aria-label="Увеличить количество"
                    disabled={orderItem.quantity>=10}>
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </Box>
              </Box>
            </Card>
    )
}