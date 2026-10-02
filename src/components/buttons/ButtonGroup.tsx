import type { ReactNode } from 'react';
interface ButtonGroupProps {
  children?: ReactNode;
}
const ButtonGroup = (props: ButtonGroupProps) => {
  const { children } = props;
  return <div className="btn-list">{children}</div>;
};
export default ButtonGroup;
