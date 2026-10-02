import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useId } from 'react';
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}
const ToggleSwitch = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: ToggleSwitchProps) => {
  const inputId = useId();
  return (
    <div
      className={clsx(
        'd-flex align-items-center justify-content-between',
        { 'cursor-pointer': !disabled },
        className
      )}
    >
      {label && (
        <label className="form-check-label mb-0 me-2" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="form-check form-switch mb-0">
        <input
          id={inputId}
          type="checkbox"
          role="switch"
          className="form-check-input cursor-pointer"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    </div>
  );
};
export default ToggleSwitch;
