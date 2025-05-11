import React, { useContext } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, Chip } from '@mui/material';
import { PizzaContext } from '../../contexts/PizzaContext';
import { Ingredient } from '../../models/ingredient';
import { IMAGE_BASE_URL } from '../../pathUtils/imagePath';


/**
 * Компонент выбора ингредиентов
 */
const IngredientSelection: React.FC = () => {
  const context =useContext(PizzaContext);
if(!context) return (<div>Контекст не найден</div>);
const {ingredients, selectedIngredientIds, setSelectedIngredientIds} = context;

/**
 * Функция обработки выбора ингредиента
 * @param ingredient - выбранный при нажатии ингредиент
 */
const toggleIngredient=(ingredient: Ingredient)=>{
 

  const exists = selectedIngredientIds.includes(ingredient.id);
  const updatedIds = exists
    ? selectedIngredientIds.filter(id => id !== ingredient.id)
    : [...selectedIngredientIds, ingredient.id];

  setSelectedIngredientIds(
   updatedIds
  );

  setSelectedIngredientIds(updatedIds);



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
          const isSelected = selectedIngredientIds.includes(ingredient.id);
          
          return (
          <Grid minHeight="150px" size={{xs:12, sm: 6, md:4, lg: 4, xl:4}}  key={ingredient.id}>
            <Card 
            onClick={()=>toggleIngredient(ingredient)}
            sx={{ display: 'flex', alignItems: 'center', 
            borderRadius: 2, p: 1,
            height:'100%',
            cursor: ingredient.isAvailable?'pointer':'not-allowed',
            flexDirection:'column',
            border:theme=>
              isSelected?'2px solid #ff9800':
            
            '1px solid #e0e0e0',
            backgroundColor:theme =>
              isSelected?'$fff3e0':
            'white',
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
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )
})}
      </Grid>
    </Box>
  );
};

export default IngredientSelection;