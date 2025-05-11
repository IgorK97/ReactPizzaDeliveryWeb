import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeliveryDialog } from '../PageComponents/DeliveryDialog';


/**
 * тесты компонента DeliveryDialog
 */
describe("DeliveryDialog", () => {
    const setup = () => {
      const onClose = jest.fn();
      const onSubmit = jest.fn();
  
      render(
        <DeliveryDialog open={true} onClose={onClose} onSubmit={onSubmit} />
      );
  
      return { onClose, onSubmit };
    };
  
    /**
     * Корректное отображение обеих опций выбора
     */
    it("Корректный рендеринг опций выбора", () => {
      setup();
  
      expect(screen.getByLabelText("Успешно доставлен")).toBeInTheDocument();
      expect(screen.getByLabelText("Не доставлен")).toBeInTheDocument();
    });
  
    /**
     * Проверка того, что при выборе опции "Не доставлен" будет отображено поле
     * для ввода комментария
     */
    it("Корректное отображение поля с комментарием, когда выбрана опция 'Не доставлен'", async () => {
      setup();
  
      fireEvent.click(screen.getByLabelText("Не доставлен"));
    const commentField = await screen.findByRole("textbox", { name: "Причина недоставки" });
expect(commentField).toBeInTheDocument();
    });

  
  
  });