import type { ReactNode } from 'react';
interface PageBodyComponentProps {
  children?: ReactNode;
}
const PageBodyComponent = (props: PageBodyComponentProps) => {
  const { children } = props;
  return (
    <div className="page-body">
      <div className="container-xl">{children}</div>
    </div>
  );
};
export default PageBodyComponent;
