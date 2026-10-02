import type { ReactNode } from 'react';
interface TableRowProps {
  children?: ReactNode;
}
const TableRow = (props: TableRowProps) => {
  const { children } = props;
  return <tr>{children}</tr>;
};
export default TableRow;
