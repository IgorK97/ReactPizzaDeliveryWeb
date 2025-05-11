// src/components/Pizza/IngredientNames.tsx
import React from 'react';
import { Typography } from '@mui/material';

interface IngredientNamesProps {
  names: string[];
}

/**
 * Компонент для представления списка ингредиентов в виде строки
 * @param {IngredientNamesProps} props - пропс, содержащий названия (массив строк) ингредиентов
 * @returns 
 */
const IngredientNames: React.FC<IngredientNamesProps> = ({ names }) => {
  if (!names.length) return null;

  return (
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      Состав: {names.join(', ')}
    </Typography>
  );
};

export default IngredientNames;