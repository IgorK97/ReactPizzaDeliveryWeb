import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItemCard } from '../PageComponents/CartItemCard';
import { OrderItem } from '../../models/OrderItem';
import '@testing-library/jest-dom';
import { PizzaSizeEnum } from '../../models/pizza';

/**
 * Макет позиции заказа
 */
const mockOrderItem: OrderItem = {
  id: 1,
  pizzaId: 1,
  pizzaName: 'Пепперони',
  pizzaImage: 'pepperoni.jpg',
  pizzaSize: 'Medium',
  itemPrice: 1200,
  itemWeight:600,
  quantity: 2,
  addedIngredientIds: [1, 2],
  defaultIngredientIds:[3,4],
  pizzaSizeId: PizzaSizeEnum.Medium
};


/**
 * Тесты компонента CartItemCard
 */
describe('CartItemCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Корректное отобрадение со всеми данными', () => {
    render(
      <CartItemCard
        orderItem={mockOrderItem}
        sizeName="Средняя (30 см)"
        ingredientList="Сыр, Пепперони"
        onRemove={jest.fn()}
        onEdit = {jest.fn()}
        onQuantityChange={jest.fn()}
      />
    );

    expect(screen.getByText('Пепперони')).toBeInTheDocument();
    expect(screen.getByText('Размер: Средняя (30 см)')).toBeInTheDocument();
    expect(screen.getByText('Сыр, Пепперони')).toBeInTheDocument();
    expect(screen.getByText('1200.00 ₽')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'pepperoni.jpg');
  });


  it('Корректное изменение количества пицц в одной позиции', () => {
const handleQuantityChange = jest.fn();

    render(<CartItemCard 
      orderItem={mockOrderItem}
      sizeName=""
      ingredientList=""
      onRemove={jest.fn()}
      onEdit = {jest.fn()}
      onQuantityChange={handleQuantityChange}
    />);


    fireEvent.click(screen.getByRole('button', { name: /увеличить количество/i }));
    expect(handleQuantityChange).toHaveBeenCalledWith(1, 3);


    fireEvent.click(screen.getByRole('button', { name: /уменьшить количество/i }));
    expect(handleQuantityChange).toHaveBeenCalledWith(1, 1);
  });

  it('Кнопки перестают быть доступны при некорректном количестве', () => {
    const minQuantityItem = { ...mockOrderItem, quantity: 1 };
    const maxQuantityItem = { ...mockOrderItem, quantity: 10 };

    const { rerender } = render(
      <CartItemCard 
        orderItem={minQuantityItem}
        sizeName=""
        ingredientList=""
        onRemove={jest.fn()}
        onEdit = {jest.fn()}
        onQuantityChange={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /уменьшить количество/i })).toBeDisabled();

    rerender(
      <CartItemCard 
        orderItem={maxQuantityItem}
        sizeName=""
        ingredientList=""
        onRemove={jest.fn()}
        onEdit = {jest.fn()}
        onQuantityChange={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /увеличить количество/i })).toBeDisabled();
  });

  it('Показывает текст по умолчанию при отсутствии ингредиентов', () => {
    const noIngredientsItem = { 
      ...mockOrderItem, 
      addedIngredientIds: [] 
    };

    render(
      <CartItemCard 
        orderItem={noIngredientsItem}
        sizeName=""
        ingredientList=""
        onRemove={jest.fn()}
        onEdit = {jest.fn()}
        onQuantityChange={jest.fn()}
      />
    );

    expect(screen.getByText(/без дополнительных ингредиентов/i)).toBeInTheDocument();
  });
});