import axios from 'axios';
import { toast } from 'react-toastify';
import { ROUTE_PATH } from './route-util';

export const getErrorStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined;

export const getErrorMessage = (error: unknown): string =>
  axios.isAxiosError(error)
    ? error.response?.data?.error ?? error.response?.data?.message ?? ''
    : '';

export const handleRequestStatusError = (
  error: unknown,
  navigate: (path: string) => void
): void => {
  if (!axios.isAxiosError(error)) {
    navigate(ROUTE_PATH.error404);
    return;
  }

  switch (error.response?.status) {
    case 400:
      toast.error(error.response?.data?.error ?? error.response?.data?.message);
      break;
    case 403:
      toast.error(String(error.response?.data));
      break;
    default:
      navigate(ROUTE_PATH.error404);
  }
};
