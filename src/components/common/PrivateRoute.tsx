import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTE_PATH } from '../../utils/route-util';
interface PrivateRouteProps {
  children?: ReactNode;
  auth?: boolean;
  redirect: string;
}
const PrivateRoute = ({
  children,
  auth = false,
  redirect,
}: PrivateRouteProps) => {
  const { loading, user } = useAuth();
  const location = useLocation();
  if (loading) return <div className="full-height-container"></div>;
  let isAuth = false;
  if (user) {
    isAuth = true;
  }
  if (loading === false && isAuth === auth) {
    const modal = document.querySelector('.modal-backdrop');
    if (modal && !isAuth) {
      modal.remove();
    }
    return (
      <div className="full-height-container">
        <Navigate
          to={redirect}
          state={{
            from: location.pathname !== ROUTE_PATH.logout ? location : null,
          }}
        />
      </div>
    );
  }
  return <>{children}</>;
};
export default PrivateRoute;
