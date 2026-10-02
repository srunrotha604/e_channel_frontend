import clsx from 'clsx';
import type { ReactNode } from 'react';
interface LabelValueItemProps {
  title?: ReactNode;
  value?: ReactNode;
  valueColorClassName?: string;
}
export const LabelValueItem = ({
  title,
  value,
  valueColorClassName,
}: LabelValueItemProps) => {
  return (
    <div className="form-group">
      <label htmlFor="name" className="control-label fs-5">
        {title}
      </label>
      <div className={clsx('fs-4 mb-2 text-primary-blue', valueColorClassName)}>
        <strong>{value || 'N/A'}</strong>
      </div>
    </div>
  );
};
