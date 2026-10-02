import { STATUS } from '../../customer/entities';
import type { BatchCustomerRow } from '../entities';
export interface BatchSubmitFormData {
  project?: { value?: string };
  policy?: { value?: string };
}
export interface BuildBatchSubmitDtoContext {
  productCode: string;
  isDraft: boolean;
}
export const buildBatchSubmitDto = (
  customerList: BatchCustomerRow[] | undefined,
  form: BatchSubmitFormData,
  context: BuildBatchSubmitDtoContext
) => ({
  customerList,
  project: form.project?.value,
  policy: form.policy?.value,
  productCode: context.productCode,
  status: context.isDraft ? STATUS.Draft : STATUS.Submitted,
});
