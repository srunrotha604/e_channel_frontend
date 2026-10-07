import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { PickerValidDate } from '@mui/x-date-pickers/models';
import { format } from 'date-fns';
import type { Dayjs } from 'dayjs';
import type { ChangeEvent } from 'react';
import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
interface CustomDatePickerProps {
  label?: string;
  value?: Date | string | number | Dayjs | null;
  onChange?: (value: string | null) => void;
  onTextChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  includeCurrentTime?: boolean;
}
const CustomDatePicker = ({
  label = '',
  value,
  onChange,
  onTextChange,
  required = false,
  placeholder = 'DD-MM-YYYY',
  includeCurrentTime = false,
}: CustomDatePickerProps) => {
  const parsedValue = value
    ? typeof value === 'object' && 'toDate' in value
      ? value.toDate()
      : new Date(value)
    : null;
  const handleChange = (value: PickerValidDate | null) => {
    const picked = value as Date | null;
    if (!picked || isNaN(picked.getTime())) {
      onChange?.(null);
      return;
    }
    const d = new Date(picked);
    if (includeCurrentTime) {
      const now = new Date();
      d.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );
    }
    const formatted = format(d, 'M/d/yyyy h:mm:ss a');
    onChange?.(formatted);
  };
  const { theme } = useTheme();
  const muiTheme = useMemo(
    () =>
      createTheme({ palette: { mode: theme === 'dark' ? 'dark' : 'light' } }),
    [theme]
  );
  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          className="custom_date_picker"
          label={label}
          value={parsedValue}
          onChange={handleChange}
          format="dd-MM-yyyy"
          minDate={new Date('1900-01-01')}
          slotProps={{
            textField: {
              size: 'small',
              required,
              fullWidth: true,
              variant: 'outlined',
              placeholder,
              onChange: onTextChange,
              InputLabelProps: { shrink: false },
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
export default CustomDatePicker;
