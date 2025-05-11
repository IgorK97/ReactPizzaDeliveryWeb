import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { Pizza } from '../../models/pizza';
import {useTheme} from '@mui/material/styles'
import IngredientList from './IngredientList';
import IngredientNames from './IngredientNames';
import { useContext } from 'react';
import { PizzaContext } from '../../contexts/PizzaContext';
import { PizzaSize } from '../../models/pizza';
import { OrderItem } from '../../models/OrderItem';
import { useAuth } from '../../contexts/AuthContext';
import { PizzaSizeEnum } from '../../models/pizza';
import { IMAGE_BASE_URL } from '../../pathUtils/imagePath';


const PIZZA_SIZES = [
  { value: PizzaSizeEnum.Small, label: '25 см' },
  { value: PizzaSizeEnum.Medium, label: '30 см' },
  { value: PizzaSizeEnum.Big, label: '35 см' },
];

interface PizzaDialogProps {
  open: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  addingNewPizzaMode:boolean;
  initialData:OrderItem|null
}

/**
 * Компонент выбора параметров пиццы, позволяет как указывать паремтры
 * уже размещенной в корзине пиццы, так и только добавляемой
 * @param {pizzaDialogProps} props - пропсы, статус открытия, функция, вызываемая при закрытии, при доабвлении пиццы в корзину
 * режима работы и начальные данные
 * @returns 
 */
const PizzaDialog: React.FC<PizzaDialogProps> = ({ open, onClose, onAddToCart, addingNewPizzaMode,initialData }) => {
  // const [selectedSize, setSelectedSize] = useState('Small');
  const {cartId}=useAuth();
  

const theme = useTheme();
  const context = useContext(PizzaContext) //Доступ к контексту пиццы
  
  


const isDarkMode = theme.palette.mode==='dark';
const { 
  fetchIngredients=()=>{},
  setCurrentOrderItem=()=>{},

  currentOrderItem=null,
  selectedSize=null,
  setSelectedSize=()=>{},
  selectedQuantity=null,
  setSelectedQuantity=()=>{},
  selectedPizza=null,
  setSelectedPizza=()=>{},
  setSelectedIngredientIds=()=>{},
  selectedIngredientIds=null,
  pizzas=[],
  ingredients=[]
} = context||{};
  useEffect(() => {
    const initData=async ()=>{
      try{
        if (open) {

          if (initialData && !addingNewPizzaMode) { //Режим редактирования
            // console.log(initialData);
            setSelectedSize(initialData.pizzaSizeId);
            // console.log("Size:", selectedSize);
            setSelectedQuantity(initialData.quantity);
            // console.log("Quantity: ", selectedQuantity);
            setSelectedIngredientIds(initialData.addedIngredientIds);
            // console.log("IngredientIds: ", selectedIngredientIds);
            const cpizza = pizzas.find(p => p.id === initialData.pizzaId);
            // console.log("Pizza: ", cpizza);
            if (cpizza) 
              setSelectedPizza(cpizza);
            setCurrentOrderItem(initialData);
          } else if (selectedPizza) { //Режим адобавления
    
              const currItem:OrderItem={
                id:0,
                pizzaId:selectedPizza? selectedPizza.id : 0,
                pizzaSize:'Small',
                pizzaSizeId: PizzaSizeEnum.Small,
                quantity:1,
                pizzaImage:"",
                pizzaName:"",
                addedIngredientIds:[],
                itemPrice:0,
                itemWeight:0,
                defaultIngredientIds:[]
              };
              setCurrentOrderItem(currItem);
          }
          else{
            setSelectedSize(PizzaSizeEnum.Small);
            setSelectedIngredientIds([]);
            setSelectedQuantity(1);
          }
          
          fetchIngredients();
    
    
    
        }
        else{
          setSelectedSize(PizzaSizeEnum.Small);
          setSelectedIngredientIds([]);
          setSelectedQuantity(1);
        }
      }
      catch(err){
        // setLocalError(err as Error);
        // return(<div>{`Произошла ошибка! Повторите позже. Сообщение: ${(err as Error).message}`}</div>)
      }
      
  }
  initData();
  }, [open, initialData]);

  if (!context || !selectedPizza) return <div></div>;



/**
 * Обработка нажатия кнопки Добавить
 */
const handleAddToCart=() => {
  onAddToCart();
  onClose();
}

const calculateTotalPrice=()=>{
  if(!selectedPizza ||!currentOrderItem || !ingredients||!selectedQuantity)return 0;
  const basePrice = selectedSize ? selectedPizza.prices[selectedSize] : 0;
  const ingredientsPrice = currentOrderItem.addedIngredientIds.reduce((total,id)=>{
    const ingredient = ingredients.find(ingr=>ingr.id===id);
    if(!ingredient)return total;

    let weight=0;
    switch(selectedSize){
      case PizzaSizeEnum.Small:weight = ingredient.small;break;
      case PizzaSizeEnum.Medium:weight=ingredient.medium;break;
      case PizzaSizeEnum.Big:weight=ingredient.big;break;
    }
    return total+(weight*ingredient.pricePerGram);
  }, 0);
  return (basePrice+ingredientsPrice)*selectedQuantity;
};

const calculateTotalWeight=()=>{
  if(!selectedPizza ||!currentOrderItem||!ingredients||!selectedQuantity)return 0;

  const baseWeight = selectedSize ? selectedPizza.weights[selectedSize]:0;
  const ingredientsWeight = currentOrderItem.addedIngredientIds.reduce((total,id)=>{
    const ingredient = ingredients.find(ingr=>ingr.id===id);
    if(!ingredient)return total;
let weight=0;
switch(selectedSize){
  case PizzaSizeEnum.Small:weight = ingredient.small;break;
  case PizzaSizeEnum.Medium:weight=ingredient.medium;break;
  case PizzaSizeEnum.Big:weight=ingredient.big;break;
}
    return total+weight;
  }, 0);
  return (baseWeight+ingredientsWeight)*selectedQuantity;
};


  return (
   <> <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px' } }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', textAlign:"center", fontWeight:'bold', fontSize:'1.2rem' }}>
        {selectedPizza.name}
      </DialogTitle>
      
      <DialogContent dividers sx={{bgcolor:isDarkMode?'gray.900' : 'white'}}>
        <Grid container spacing={4} sx={{ py: 2 }}>
          <Grid size={{xs:12, sm: 6, md:6, lg: 6, xl:6}}>
            <Box
              component="img"
              src={`${IMAGE_BASE_URL}${selectedPizza.image}`}
              alt={selectedPizza.name}
              sx={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: 3
              }}
            />
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.200', borderRadius: '8px', textAlign:'left' }}>
              <Typography variant="h5" gutterBottom color={isDarkMode?"black":"text.primary"}>
                Итого:
              </Typography>
              <Typography variant="h6" color={isDarkMode?"black":"text.primary"}>
  
                Вес: {calculateTotalWeight().toFixed(2)} г
              </Typography>
              <Typography variant="h6" color={isDarkMode?"red":"primary"}>
 
              Цена: {calculateTotalPrice().toFixed(2)} ₽
              </Typography>
            </Box>
          </Grid>

          <Grid size={{xs:12, sm: 6, md:6, lg: 6, xl:6}}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              {selectedPizza.description}
            </Typography>
<IngredientNames names={selectedPizza.ingredients.map(ingr => ingr.name)}/>
            <RadioGroup
            row
              value={selectedSize?.toString()}
              onChange={(e) => {

                setSelectedSize(Number(e.target.value));

              }}
              sx={{ gap:2, flexWrap:'wrap',my: 2 }}
            >
              {PIZZA_SIZES.map(({value, label}) =>{

return (
    <FormControlLabel
      key={value}
      value={value.toString()}
      control={<Radio sx={{display:'none'}}color="primary" />}
      label={
        <Box
        sx={{
            px:3,
            py:1,
            
            borderRadius:99,
            border:selectedSize===value?'2px solid':'1px solid',
            borderColor:selectedSize===value?'primary.main':'grey.400',
            backgroundColor: selectedSize===value?'primary.light':'grey.200',
            color:selectedSize===value?'white':'black',
            textAlign:'center',
            minWidth:120,
            transition:'all 0.3s ease',
            cursor:'pointer',
        }}
        >
            {label}
            </Box>
       
      }
      sx={{m:0}}
    />
  )
              } )}
            </RadioGroup>
<Box sx={{display:'flex', allignItems:'center', gap:2,mt:2}}>
    <Typography sx={{display:'flex', alignItems:'center'}}>Количество: </Typography>
    <TextField
              
              type="number"
              variant="outlined"
              fullWidth
              value={selectedQuantity}
              onChange={(e) => {
                const v:number = parseInt(e.target.value);
                let value:number;
if(v<1)
  value=1;
else if(v>10)
  value=10;
else value=v;
                setSelectedQuantity(value);
              }}
              InputProps={{
                inputProps: { 
                  min: 1, 
                  max: 10,
                  style: { textAlign: 'center' }
                }
              }}
              sx={{ width:80 }}
            />
</Box>
            

            <IngredientList/>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={()=>{
            onClose();
          setCurrentOrderItem(null);
          setSelectedSize(PizzaSizeEnum.Small);
      setSelectedIngredientIds([]);
      setSelectedQuantity(1);

          }} 
          variant="outlined" 
          sx={{ mr: 2, px: 4 }}
        >
          Назад
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart }
          sx={{ px: 6 }}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>

    
      </>
  );
};

export default PizzaDialog;