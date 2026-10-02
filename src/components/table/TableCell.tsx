import { useState } from 'react';
import CopyClipboard from '../../components/CopyClipboard';
interface TableCellProps {
  value?: string;
  className?: string;
  copy?: boolean;
}
const TableCell = (props: TableCellProps) => {
  const { value, className, copy } = props;
  const [isShown, setIsShown] = useState(false);
  return (
    <td
      className={`${className}`}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {value}
      {copy && isShown ? <CopyClipboard data={value} /> : ''}
    </td>
  );
};
export default TableCell;
