import { fireEvent, render, screen } from '@testing-library/react';
import { PizzaCard } from '../PageComponents/PizzaCard';
import { UserRole } from '../../models/UserRole';
import { PizzaSizeEnum } from '../../models/pizza';

/**
 * макет пиццы
 */
const mockPizza = {
  id: 1,
  name: 'Test Pizza',
  description: 'Test Pizza Description',
  prices: {
    [PizzaSizeEnum.Small]: 300,
    [PizzaSizeEnum.Medium]: 450,
    [PizzaSizeEnum.Big]: 600,
  },
  isAvailable: true,
  image: 'test_pizza_image.jpg',
  ingredients:[],
  weights:{
    [PizzaSizeEnum.Small]: 300,
    [PizzaSizeEnum.Medium]: 450,
    [PizzaSizeEnum.Big]: 600,
  }
};

/**
 * Макеты передаваемых функций
 */
const mockSelectPizza = jest.fn();
const mockNavigateToEdit = jest.fn();

describe('PizzaCard', () => {
  /**
   * проверка того, что кнопка "В корзину" не отображается для пользователя
   * с ролью менеджера
   */
  it('Не должно отображать кнопку "В корзину" для менеджера', () => {
    render(
      <PizzaCard
        pizza={mockPizza}
        userRole={UserRole.Manager}
        onSelectPizza={mockSelectPizza}
        onNavigateToEdit={mockNavigateToEdit}
      />
    );

    expect(screen.queryByRole('button', { name: /в корзину/i })).toBeNull();
  });

  /**
   * проверка того, что кнопка В корзину отображается для клиента
   */
  it('Должно отображать кнопку "В корзину" для клиента', () => {
    render(
      <PizzaCard
        pizza={mockPizza}
        userRole={UserRole.Client}
        onSelectPizza={mockSelectPizza}
        onNavigateToEdit={mockNavigateToEdit}
      />
    );

    expect(screen.getByRole('button', { name: /в корзину/i })).toBeInTheDocument();
  });

  /**
   * Проверка того, что кнопка В корзину не должна быть активна, если пицца временно отсутствует в ассортименте
   * (при isAvailable=false)
   */
  it('Кнопка "В корзину" не должна быть активна, если пицца временно отсутствует в ассортименте', () => {
    const unavailablePizza = { ...mockPizza, isAvailable: false };
    
    render(
      <PizzaCard
        pizza={unavailablePizza}
        userRole={UserRole.Client}
        onSelectPizza={mockSelectPizza}
        onNavigateToEdit={mockNavigateToEdit}
      />
    );
  
    expect(screen.getByRole('button', { name: /в корзину/i })).toBeDisabled();
  });

  /**
   * Проверка того, что при нажатии по кнопке будет вызвано корректное действие выбора пиццы
   */
  it('Должен быть вызван onSelectPizza по клику кнопки', () => {
    render(
      <PizzaCard
        pizza={mockPizza}
        userRole={UserRole.Client}
        onSelectPizza={mockSelectPizza}
        onNavigateToEdit={mockNavigateToEdit}
      />
    );
  
    screen.getByRole('button', { name: /в корзину/i }).click();
    expect(mockSelectPizza).toHaveBeenCalledWith(mockPizza);
  });

  /**
   * Проверка того, что при клике по CardActionArea пользователя с ролью клиент
   * будет вызван onSelectPizza
   */
  it('Вызывает onSelectPizza при клике на саму карточку, если роль клиента и пицца доступна', ()=>{
    const onSelectPizza = jest.fn();
    const onNavigateToEdit=jest.fn();

    render(
      <PizzaCard
      pizza={mockPizza}
      userRole={UserRole.Client}
      onSelectPizza={onSelectPizza}
      onNavigateToEdit={onNavigateToEdit}
      />
    );
    
    const cardAction = screen.getByTestId('pizza-card-action');
    fireEvent.click(cardAction);

    expect(onSelectPizza).toHaveBeenCalledWith(mockPizza);
    expect(onNavigateToEdit).not.toHaveBeenCalled();
  })
});