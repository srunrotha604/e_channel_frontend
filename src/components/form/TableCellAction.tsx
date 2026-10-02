import type { ReactNode } from 'react';
interface TableCellActionProps {
  children?: ReactNode;
}
const TableCellAction = (props: TableCellActionProps) => {
  const { children } = props;
  return <td>{children}</td>;
};
export default TableCellAction;
