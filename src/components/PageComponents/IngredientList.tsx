// src/components/Pizza/IngredientList.tsx
import React, { useContext } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, Chip } from '@mui/material';
import { PizzaContext } from '../../contexts/PizzaContext';
import { Ingredient } from '../../models/ingredient';
import { PizzaSizeEnum } from '../../models/pizza';
import ingredientService from '../../services/IngredientService';
import { IMAGE_BASE_URL } from '../../pathUtils/imagePath';
import ErrorBoundary from '../../errorHandling/ErrorBoundary';


/**
 * Компоннет выбора ингредиентов при определении параметров пиццы из ассортимента
 */
const IngredientList: React.FC = () => {
  const context =useContext(PizzaContext);
if(!context) return (<div>Контекст не найден</div>);

const {ingredients, currentOrderItem, setCurrentOrderItem, selectedSize, selectedIngredientIds, setSelectedIngredientIds} = context;
if(!currentOrderItem || !selectedSize)
  return <div> Выберите размер пиццы </div>;


/**
 * Выбор ингредиента
 * @param ingredient - выбранный ингрежиент
 * @returns 
 */
const toggleIngredient=(ingredient: Ingredient)=>{
 
if(!currentOrderItem || !ingredient.isAvailable) return;
  const exists = currentOrderItem.addedIngredientIds.includes(ingredient.id);
  const updatedIds = exists
    ? currentOrderItem.addedIngredientIds.filter(id => id !== ingredient.id)
    : [...currentOrderItem.addedIngredientIds, ingredient.id];

  setCurrentOrderItem({
    ...currentOrderItem,
    addedIngredientIds: updatedIds
  });

  setSelectedIngredientIds(updatedIds);



};

/**
 * Возвратить вес ингредиента в зависимости от текущего размера пиццы
 * @param ingredient 
 * @returns 
 */
const getWeightForSize = (ingredient:Ingredient)=>{
  switch(selectedSize){
    case PizzaSizeEnum.Small:return ingredient.small;
    case PizzaSizeEnum.Medium:return ingredient.medium;
    case PizzaSizeEnum.Big:return ingredient.big;
    default:return 0;
  }
};

/**
 * Высчитать стоимость ингредиента, войдущего в пиццу с текущим размером пиццы
 * @param ingredient - ингредиент
 * @returns 
 */
const calculatePrice = (ingredient:Ingredient)=>{
  const weight = getWeightForSize(ingredient);
  return (weight*ingredient.pricePerGram).toFixed(2);
};





  return (
    <Box
      sx={{
        maxHeight: 400,
        overflowY: 'auto',
        mt: 4,
        pr: 1
      }}
    >
      <Grid container spacing={2}>
        {ingredients.map((ingredient) => {
          const isSelected = currentOrderItem.addedIngredientIds.includes(ingredient.id);
          const weight = getWeightForSize(ingredient);
          const price = calculatePrice(ingredient);
          return (
          <Grid minHeight="150px" size={{xs:12, sm: 6, md:4, lg: 4, xl:4}}  key={ingredient.id}>
            <ErrorBoundary fallback={<div>Ошибка ингредиента</div>}>
            <Card 
            onClick={()=>ingredient.isAvailable&&toggleIngredient(ingredient)}
            sx={{ display: 'flex', alignItems: 'center', 
            borderRadius: 2, p: 1,
            height:'100%',
            cursor: ingredient.isAvailable?'pointer':'not-allowed',
            flexDirection:'column',
            border:theme=>
              isSelected && ingredient.isAvailable?'2px solid #ff9800':
            !ingredient.isAvailable? '1px solid #ffcdd2':
            '1px solid #e0e0e0',
            backgroundColor:theme =>
              isSelected && ingredient.isAvailable?'$fff3e0':
            !ingredient.isAvailable ? '#f5f5f5' : 'white',
            transition:'border-color 0.3s',
            '&:hover':{
              boxShadow:ingredient.isAvailable ? 2:'none'
            } }}>
              <CardMedia
                component="img"
                image={`${IMAGE_BASE_URL}${ingredient.image}`}
                alt={ingredient.name}
                sx={{ width: 60, height: 60, 
                  borderRadius: 1, objectFit: 'cover', mr: 2,
                opacity:ingredient.isAvailable ? 1:0.6 }}
              />
              <CardContent sx={{ flex: 1, p: 0 }}>
                <Box display="flex" flexDirection="column"
                alignItems="center" gap={0.5}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {ingredient.name}
                </Typography>
                {!ingredient.isAvailable && (
                  <Chip
                  
                  label="Нет в наличии"
                  size="small"
                  color="error"/>
                )}
               
                <Typography variant="body2" color="text.secondary">
                  {weight} г · {price} ₽
                </Typography>
                </Box>
              </CardContent>
            </Card>
            </ErrorBoundary>
          </Grid>
        )
})}
      </Grid>
    </Box>
  );
};

export default IngredientList;