import type { FileWithPath } from 'react-dropzone';
import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  CustomerListResponse,
  CustomerRawListResponse,
} from '../../../customer/entities';
import { mapCustomerTransaction } from '../../../customer/use-cases';
import type { BatchCustomerListResult } from '../../entities';
export const uploadBatchExcel = (
  files: FileWithPath[],
  data: { ProjectCode?: string; Policies?: string; ProductCode: string }
) => {
  const formData = new FormData();
  files.forEach((item) => {
    formData.append('files', item);
  });
  formData.append('data', JSON.stringify(data));

  return HttpUtil.post<BatchCustomerListResult>(
    ROUTE_API.operationCustomerBatchUpload,
    formData
  );
};
export const submitBatchCustomerList = async (
  data: Record<string, unknown>
) => {
  const response = await HttpUtil.post(ROUTE_API.operationCustomerBatch, data);
  return response?.data;
};
export const fetchBatchTransactionList = async (
  batchNumber: string,
  params: Record<string, unknown>
): Promise<CustomerListResponse | null> => {
  const response = await HttpUtil.get<CustomerRawListResponse>(
    `${ROUTE_API.operationCustomerBatch}?batchNumber=${batchNumber}`,
    { params }
  );
  if (!response?.data) return null;
  return {
    ...response.data,
    list: response.data.list?.map(mapCustomerTransaction),
  };
};
export const processBatchTransactions = async (
  data: Record<string, unknown>
) => {
  const response = await HttpUtil.post(ROUTE_API.operationCustomerBatch, data);
  return response?.data;
};
