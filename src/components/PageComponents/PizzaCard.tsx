
import { 
  Grid, 
  Card, 
  CardActionArea, 
  CardMedia, 
  CardContent, 
  Box, 
  Typography, 
  Chip, 
  Button 
} from '@mui/material';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
// import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../../models/UserRole';
import { Pizza } from '../../models/pizza';
import { PizzaSizeEnum } from '../../models/pizza';
import { IMAGE_BASE_URL } from '../../pathUtils/imagePath';

/**
 * Интерфейс для типизации пропсов
 */
interface PizzaCardProps{
    pizza:Pizza;
    userRole:UserRole;
    onSelectPizza:(pizza:Pizza)=>void; //Действие, совершаемое при нажатии кнопки выбрать
    onNavigateToEdit:(id:number)=>void; //Действие. совершаемое при нажатии на картинку
}

/**
 * Компонент, отображающий единственную пиццу с картинкой, опсианием и ценой за маленькую такую пиццу
 * @param {PizzaCardProps} props - пропсы, содержащие пиццу, роль пользователя, методы, которые нужно совершать при выборе пиццы
 * @returns 
 */
export const PizzaCard:React.FC<PizzaCardProps>=({pizza,userRole,onSelectPizza,onNavigateToEdit})=>{
    // const navigate = useNavigate();

    return (
        <Grid size={{xs:12, sm: 7, md:4, lg: 4, xl:4}} key={pizza.id}>
              
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea 
                data-testId="pizza-card-action"
                // component={Link} to={`/pizzas/${piz.id}`}
                onClick={(e)=>{
                    
                  e.preventDefault();
                  if(userRole===UserRole.Manager){
                    onNavigateToEdit(pizza.id);
                  }
                  else if(userRole===UserRole.Client && pizza.isAvailable){
                    onSelectPizza(pizza);
                  }
                }}
                >
                  {pizza.image && (
                    <CardMedia
                      component="img"
                      height="250"
                      image={`${IMAGE_BASE_URL}${pizza.image}`}
                      alt={pizza.name}
                      sx={{objectFit: 'cover' }}
                    />
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', flexWrap:'wrap', alignItems:'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {pizza.name}
                      </Typography>
                      <Chip 
                        label={pizza.isAvailable ? "В наличии" : "Нет в наличии"} 
                        color={pizza.isAvailable ? "success" : "error"} 
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {pizza.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="body2" color="primary">
                        От {pizza.prices[PizzaSizeEnum.Small]} ₽
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (маленькая)
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>

                <Box sx={{ p: 2, display: 'flex', gap: 2, mt: 'auto' }}>
                
                  
                  {userRole===UserRole.Client && <Button
                    variant="contained"
                    startIcon={<ShoppingCartOutlined />}
                    size="small"
                    disabled={!pizza.isAvailable}
                    sx={{ ml: 'auto' }}
                    onClick={(e)=>{
                      e.preventDefault();
                      onSelectPizza(pizza);
                    }}
                  >
                    В корзину
                  </Button>}
                </Box>
              </Card>
             
                
            </Grid>
    )
  
}