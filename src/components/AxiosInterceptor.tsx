import type { AxiosError } from 'axios';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import type { ReactNode } from 'react';
import { useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { refreshToken } from '../utils/http-util';
import { ROUTE_PATH } from '../utils/route-util';
import { STORAGE_KEY } from '../utils/storage-key';
interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}
interface AxiosInterceptorProps {
  children?: ReactNode;
}
const AxiosInterceptor = ({ children }: AxiosInterceptorProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  useLayoutEffect(() => {
    const decodeJwtPayload = (jwt: string): JwtPayload => {
      const parts = jwt.split('.');
      if (parts.length < 2) {
        throw new Error('Invalid token format');
      }
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padLength = 4 - (base64.length % 4);
      if (padLength !== 4) {
        base64 = base64.padEnd(base64.length + padLength, '=');
      }
      const jsonPayload = atob(base64);
      return JSON.parse(jsonPayload);
    };
    const checkTokenExpiry = () => {
      const e_chanel_storage = localStorage.getItem(STORAGE_KEY);
      if (!e_chanel_storage) return;
      try {
        const parsed = JSON.parse(e_chanel_storage);
        const refreshTokenStr = parsed?.refreshToken;
        if (!refreshTokenStr) return;
        const payload = decodeJwtPayload(refreshTokenStr);

        if (typeof payload.exp === 'number') {
          const expiryDate = new Date(payload.exp * 1000);
          const now = new Date();
          if (expiryDate <= now) {
            toast.error('Your session has expired. Please log in again.');
            localStorage.removeItem(STORAGE_KEY);
            navigate(ROUTE_PATH.logout, {
              replace: true,
              state: { from: location },
            });
          }
        }
      } catch (err) {
        console.error('Token parsing/decoding failed:', err);
        toast.error('Authentication error. Please log in again.');
        localStorage.removeItem(STORAGE_KEY);
        navigate(ROUTE_PATH.logout, {
          replace: true,
          state: { from: location },
        });
      }
    };
    const refreshAuthLogic = async (failedRequest: AxiosError) => {
      try {
        const tokenObj = await refreshToken();
        if (failedRequest.response) {
          failedRequest.response.config.headers['Authorization'] =
            'Bearer ' + tokenObj.token;
        }
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + tokenObj.token;
        return Promise.resolve();
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        toast.error('Your session has expired. Please log in again.');
        navigate(ROUTE_PATH.logout, {
          replace: true,
          state: { from: location },
        });
        return Promise.reject(error);
      }
    };
    const interceptorId = createAuthRefreshInterceptor(
      axios,
      refreshAuthLogic,
      { pauseInstanceWhileRefreshing: true }
    );
    const intervalId = setInterval(checkTokenExpiry, 15 * 60 * 1000);
    return () => {
      clearInterval(intervalId);
      axios.interceptors.response.eject(interceptorId);
    };
  }, [navigate, location]);
  return children;
};
export default AxiosInterceptor;
