export interface MessageResponse {
  message?: string;
}

export interface Profile {
  mode: any;
  userProfile: UserProfileNew;
  access: Access;
  application: Application;
  version: Version;
  company: Company[];
  menuItems: MenuItem[];
  module: Module[];
  processAccess: ProcessAccess;
  productAuthorizedLimits: ProductAuthorizedLimits;
  passwordStatus: PasswordChangeStatus;
}

export interface UserProfileNew {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  avatar: string;
  avatarUrl: string;
  uuid: any;
}
export interface ResProfile {
  mode: any;
  userProfile: UserProfile;
  access: Access;
  application: Application;
  version: Version;
  company: Company[];
  menuItems: MenuItem[];
  module: Module[];
  processAccess: ProcessAccess;
  productAuthorizedLimits: ProductAuthorizedLimits;
  passwordStatus: PasswordChangeStatus;
}
export interface PasswordChangeStatus {
  passwordExpirationDays: number;
  passwordChangedDate: string;
  passwordExpirationDate: string;
  daysRemaining: number;
  expired: boolean;
  expiringSoon: boolean;
  message: string;
}
export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  avatar: string;
  avatarUrl: string;
  uuid: any;
  channelCode: string;
  channelUuid: string;
}

export interface Access {
  companyBranchAccess: CompanyBranchAccess;
}

export interface CompanyBranchAccess {
  company: string;
  branch: string;
}

export interface Application {
  applicationName: string;
  roleName: string;
}

export interface Version {
  releaseDate: string;
  version: string;
  description: string;
  commitSha: string;
  environment: string;
  buildTime: string;
  highlights: string[];
  fixes: any[];
  notes: string;
  docsLabel: string;
  docsUrl: string;
}

export interface Company {
  companyCode: string;
  companyName: string;
  companyLogo: string;
  companyLogoUrl: string;
  branch: Branch[];
}

export interface Branch {
  companyCode: string;
  branchCode: string;
  branchName: string;
}

export interface MenuItem {
  name: string;
  code: string;
  type: string;
  active: boolean;
  [key: string]: unknown;
}

export interface Module {
  code: string;
  name: string;
  parameter: string;
  permission: Permission[];
  permissionStatus: PermissionStatus;
  [key: string]: unknown;
}

export interface Permission {
  parameter: string;
  method: string;
  active: boolean;
}

export interface PermissionStatus {
  strictProcess: StrictProcess[];
  strictAccess: StrictAccess[];
}

export interface StrictProcess {
  statusCode: string;
  statusName: string;
  active: boolean;
}

export interface StrictAccess {
  statusCode: string;
  statusName: string;
  active: boolean;
}

export interface ProcessAccess {
  strictProcess: any[];
  strictAccess: any[];
}

export interface ProductAuthorizedLimits {}
