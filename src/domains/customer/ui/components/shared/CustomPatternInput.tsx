import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { forwardRef } from 'react';
import { PatternFormat } from 'react-number-format';
interface CustomPatternProps {
  value?: string;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}
// eslint-disable-next-line react/display-name
const CustomPatternInput = forwardRef<HTMLInputElement, CustomPatternProps>(
  ({ value, onClick, onChange, onFocus, onKeyDown }, ref) => {
    return (
      <PatternFormat
        className="form-control"
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        format={'##-##-#####'}
        placeholder={'dd-mm-yyyy'}
        onChange={onChange}
        value={value}
        required
        onClick={onClick}
        getInputRef={ref}
      />
    );
  }
);
export default CustomPatternInput;
