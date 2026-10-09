import type { AxiosError, AxiosRequestConfig, ResponseType } from 'axios';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getEnv } from './env';
import { ROUTE_API, ROUTE_PATH } from './route-util';
import { STORAGE_KEY } from './storage-key';

export const valid_token_data = () => {
  const storage = localStorage.getItem(STORAGE_KEY);

  const defaultData = {
    token: '',
    refreshToken: '',
    login_return_url: '',
    company: '',
    branch: '',
    hostName: window.location.origin,
  };

  if (!storage) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return;
  }

  try {
    const parsed = JSON.parse(storage);
    const merged = { ...defaultData, ...parsed };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.log(e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  }
};

const readStoredToken = () => {
  const alt_fa_storage = localStorage.getItem(STORAGE_KEY) || '';
  return JSON.parse(alt_fa_storage);
};

const buildHeaders = (tokenText: any, data: unknown, skipAuth?: boolean) => {
  const headers: Record<string, unknown> = {
    application_id: import.meta.env.VITE_APP_ID,
    company: tokenText.company,
    branch: tokenText.branch,
    accept: '*',
  };

  if (tokenText.token && !skipAuth) {
    headers.authorization = `Bearer ${tokenText.token}`;
  }
  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  company?: string;
  branch?: string;
  expiration?: string;
  tokenExpiration?: string;
  message?: string;
}

const refreshToken = async () => {
  const storage = localStorage.getItem(STORAGE_KEY) || '';
  const token_text = JSON.parse(storage);
  if (!storage) {
    throw new Error('No token data in localStorage');
  }
  if (!token_text.token || !token_text.refreshToken) {
    throw new Error('Missing token / refreshToken');
  }

  const data = {
    accessToken: token_text.token,
    refreshToken: token_text.refreshToken,
  };

  const res = await axios<RefreshTokenResponse>({
    url: getEnv('VITE_API_URL') + ROUTE_API.loginRefreshToken,
    method: 'POST',
    data: data,
    headers: buildHeaders(
      token_text,
      data,
      true
    ) as AxiosRequestConfig['headers'],
  });

  const alt_fa_token = {
    token: res.data.accessToken,
    refreshToken: res.data.refreshToken,
    company: token_text.company || '',
    branch: token_text.branch || '',
    hostName: window.location.origin,
    login_return_url: token_text.login_return_url || '',
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(alt_fa_token));

  return alt_fa_token;
};

const httpClient = axios.create({
  baseURL: ROUTE_API.root,
});

httpClient.interceptors.request.use((config) => {
  valid_token_data();
  const tokenText = readStoredToken();
  const skipAuth = (config as unknown as { skipAuth?: boolean }).skipAuth;
  config.headers = {
    ...config.headers,
    ...buildHeaders(tokenText, config.data, skipAuth),
  } as any;
  return config;
});

interface RetryQueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  config: AxiosRequestConfig;
}

const refreshAndRetryQueue: RetryQueueItem[] = [];
let isRefreshing = false;

httpClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const tokenObj = await refreshToken();
        originalRequest.headers = {
          ...originalRequest.headers,
          authorization: `Bearer ${tokenObj.token}`,
        } as any;

        refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
          httpClient(config).then(resolve).catch(reject);
        });
        refreshAndRetryQueue.length = 0;
        isRefreshing = false;

        return httpClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshAndRetryQueue.length = 0;
        localStorage.removeItem(STORAGE_KEY);
        toast.error('Your session has expired. Please log in again.');
        window.location.href = ROUTE_PATH.logout;
        return Promise.reject(refreshError);
      }
    }

    return new Promise((resolve, reject) => {
      refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
    });
  }
);

type MaybeAxiosResponse<T> = Promise<import('axios').AxiosResponse<T>>;

interface HttpUtilOptions {
  params?: unknown;
  responseType?: ResponseType;
  signal?: AbortSignal;
  skipAuth?: boolean;
  [key: string]: unknown;
}

const request = <T = unknown,>(
  url: string,
  method: string,
  data?: unknown,
  options: HttpUtilOptions = {}
): MaybeAxiosResponse<T> => {
  const config: AxiosRequestConfig = {
    ...options,
    url,
    method: method as AxiosRequestConfig['method'],
    data,
  };

  return httpClient<T>(config);
};

interface HttpUtilFn {
  get: <T = unknown>(
    url: string,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
  post: <T = unknown>(
    url: string,
    data?: unknown,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
  put: <T = unknown>(
    url: string,
    data?: unknown,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
  delete: <T = unknown>(
    url: string,
    data?: unknown,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
}

export const HttpUtil: HttpUtilFn = {
  get: (url, options) => request(url, 'GET', undefined, options),
  post: (url, data, options) => request(url, 'POST', data, options),
  put: (url, data, options) => request(url, 'PUT', data, options),
  patch: (url, data, options) => request(url, 'PATCH', data, options),
  delete: (url, data, options) => request(url, 'DELETE', data, options),
};
