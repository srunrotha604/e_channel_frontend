export interface ProductOption {
  productsequenceCode?: string;
  productCode?: string;
  productName?: string;
}
export interface ProductListResponse {
  list?: ProductOption[];
  message?: string;
}
