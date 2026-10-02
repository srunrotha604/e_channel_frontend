import type { ReactNode } from 'react';
import { LabelValueItem } from './LabelValueItem';
interface LabelValueListItem {
  label?: ReactNode;
  value?: ReactNode;
}
interface LabelValueListProps {
  list?: LabelValueListItem[];
  valueColorClassName?: string;
  columnClassName?: string;
}
const LabelValueList = ({
  list,
  valueColorClassName = '',
  columnClassName,
}: LabelValueListProps) => {
  return (
    <div className="row">
      {list?.map((item, index) => (
        <div
          key={index}
          className={columnClassName ? columnClassName : 'col-xs-4 col-md-6'}
        >
          {item?.label && (
            <LabelValueItem
              title={item.label}
              value={item.value}
              valueColorClassName={valueColorClassName}
            />
          )}
        </div>
      ))}
    </div>
  );
};
export default LabelValueList;
