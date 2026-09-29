import { Dispatch, SetStateAction } from 'react';
import type {
  Application,
  Branch,
  Company,
  Module,
  PasswordChangeStatus,
  UserProfileNew,
  Version,
} from './profile';

export interface PermissionSet {
  process?: Record<string, unknown>;
  access?: Record<string, unknown>;
  driAdmin?: boolean;
}

export interface AuthToken {
  token?: string;
  refreshToken?: string;
  company?: string;
  branch?: string;
  login_return_url?: string;
  hostName?: string;
}

export interface AuthContextValue {
  loading: boolean;
  hasPermissionProccessTransaction: (
    execution: string | string[],
    condition?: 'and' | 'or'
  ) => boolean;
  hasPermissionAccessTransaction: (
    execution: string | string[],
    condition?: 'and' | 'or'
  ) => boolean;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
  setPasswordStaus: Dispatch<SetStateAction<PasswordChangeStatus | null>>;
  user: UserProfileNew | null;
  isUserDRIAdmin: boolean;
  appName: string;
  menu: unknown[];
  company: Company[] | null;
  selectedBranch: Branch | null | undefined;
  selectedCompany: Company | null | undefined;
  permission: PermissionSet | null;
  module: Module[] | null;
  token: AuthToken | null;
  mode: string;
  application: Application | null;
  version: Version | null;
  passwordStatus: PasswordChangeStatus | null;
}
