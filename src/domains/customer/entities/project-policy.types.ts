export interface ProjectPolicyOption {
  label?: string;
  value?: string;
  policies?: { label?: string; value?: string; policyExpireDate?: string }[];
}
export interface ProjectCategoryResponse {
  category?: ProjectPolicyOption[];
  message?: string;
}
