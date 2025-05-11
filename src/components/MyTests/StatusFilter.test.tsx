import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusFilter } from '../PageComponents/StatusFilter';
import { ThemeProvider, createTheme } from '@mui/material/styles';

/**
 * Набор тестов для компонента StatusFilter
 */
describe('StatusFilter', () => {

  /**
   * Проверка того, что компонент корректно рендерится без ошибок
   */
    it('Рендерится без сбоев', () => {
      render(<StatusFilter value={0} onChange={() => {}} statusOptions={[]} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    /**
     * Проверка корректного отображения переданной опции
     */
    it('Отображает корректно вариант выбора', () => {
        const singleOption = [{ value: 1, label: 'Тест' }];
const theme = createTheme();
        
        render(
          <ThemeProvider theme={theme}>
            <StatusFilter 
              value={1} 
              onChange={()=>{}} 
              statusOptions={singleOption} 
            />
          </ThemeProvider>
        );
      
        expect(screen.getByText('Тест')).toBeInTheDocument();
        const select = screen.getByTestId('select');
        expect(select).toHaveValue('1');
      });

      const TEST_OPTIONS = [
        { value: 1, label: 'Статус 1' },
        { value: 2, label: 'Статус 2' },
        { value: 3, label: 'Статус 3' }
      ];
      /**
       * Проверка того, что при выборе нового значения он будет установлен
       * Имитируется клик пользователя по выпадающему списку и выбор второго статуса
       */
      it('Корректная смена выбранного элемента при действии пользователя', async () => {
        const handleChange = jest.fn();
        const theme = createTheme();
      
        render(
          <ThemeProvider theme={theme}>
            <StatusFilter 
              value={1} 
              onChange={handleChange} 
              statusOptions={TEST_OPTIONS} 
            />
          </ThemeProvider>
        );
      
        const user = userEvent.setup();
      
        const select = screen.getByRole('combobox');
        await user.click(select); //Открытие выпадающего списка
      

        const option = await screen.findByText('Статус 2');
        await user.click(option); //Выбора второго статуса
      
        expect(handleChange).toHaveBeenCalledWith(2); //Проверка
      });
      
  });