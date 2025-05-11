
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { OrderStatusEnum } from '../../models/HistoryOrder';
import StatusOption from '../../models/StatusOption';



/**
 * Константа для значения "Все статусы"
 */
const ALL_STATUSES_VALUE = 0;

/**
 * Типизация пропсов для компонента StatusFilter
 */
interface StatusFilterProps {
  value: number; //Текущее значнеие фильтра
  onChange: (statusId: number) => void;
  statusOptions:StatusOption[];
}


/**
 * Компоненрт фильтра статусов для заказов
 * Выпадающий список для фильтрации заказов по статусу
 * @param {StatusFilterProps} props - пропсы компонента, текущее значение, функция изменения значений и массив опций
 * @returns {JSX.Element} отображает UI для фильтрации
 */
export const StatusFilter = ({ value, onChange, statusOptions }: StatusFilterProps) => {
  // const handleChange = (event: SelectChangeEvent<number | ''>) => {
  //   const newValue = event.target.value;
  //   onChange(Number(newValue));
  // };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 250 }}>
      <InputLabel>Фильтр по статусу </InputLabel>
      <Select
        value={value}
        onChange={(e)=>{
          const newValue = e.target.value;
          onChange(Number(newValue));
        }}
        label="Фильтр по статусу"
        inputProps={{"data-testid":"select"}}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};