import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  IResponseLogout,
  LoginResponse,
  StreamTicketResponse,
} from '../../entities';
export const login = (data: { userName: string; Password: string }) =>
  HttpUtil.post<LoginResponse>(ROUTE_API.login, data);
export const createStreamTicket = () =>
  HttpUtil.post<StreamTicketResponse>(ROUTE_API.streamTicket);
export const logout = (data: { refreshToken: string }) =>
  HttpUtil.post<IResponseLogout>(ROUTE_API.logout, data);
