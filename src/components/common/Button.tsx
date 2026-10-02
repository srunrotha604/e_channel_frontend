import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
  loading?: boolean;
  loadingText?: ReactNode;
}
const Button = ({
  variant = 'primary',
  size = undefined,
  children,
  loading = false,
  loadingText = 'Loading...',
  className = '',
  ...otherProps
}: ButtonProps) => {
  return (
    <button
      disabled={loading}
      className={clsx(`btn btn-${variant} ${className}`, {
        [`btn-${size}`]: size,
      })}
      type="button"
      {...otherProps}
    >
      {loading ? (
        <>
          <span
            style={{ marginRight: '5px' }}
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};
export default Button;
