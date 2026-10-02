import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  ProductListResponse,
  ProjectCategoryResponse,
} from '../../entities';
export const fetchProductList = () =>
  HttpUtil.get<ProductListResponse>(ROUTE_API.operationCustomerProduct);
export const fetchProductAndPoliciesBySequenceCode = (
  productSequenceCode: string
) =>
  HttpUtil.get<ProductListResponse & ProjectCategoryResponse>(
    `${ROUTE_API.operationCustomerProduct}/${productSequenceCode}`
  );
export const fetchPoliciesByProductCode = (productCode: string) =>
  HttpUtil.get<ProjectCategoryResponse>(
    `${ROUTE_API.operationCustomerProduct}/${productCode}`
  );
