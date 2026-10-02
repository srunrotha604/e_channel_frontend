import clsx from 'clsx';
interface CheckboxProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  disableGutter?: boolean;
  disabled?: boolean;
}
const Checkbox = ({
  checked,
  onChange,
  disableGutter,
  disabled = false,
}: CheckboxProps) => {
  return (
    <input
      checked={checked}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
      type="checkbox"
      disabled={disabled}
      className={clsx(
        'form-check-input cursor-pointer border border-secondary rounded',
        { 'mx-2': !disableGutter }
      )}
    />
  );
};
export default Checkbox;
