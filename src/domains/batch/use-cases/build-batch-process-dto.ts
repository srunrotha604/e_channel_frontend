export interface BuildBatchProcessDtoParams {
  status: string | null;
  batchNumber?: string;
  selectedAll: boolean;
  selectedTransaction: string[];
  rejectRemark?: string;
}
export const buildBatchProcessDto = ({
  status,
  batchNumber,
  selectedAll,
  selectedTransaction,
  rejectRemark,
}: BuildBatchProcessDtoParams) => {
  const summaryDate: {
    status: string | null;
    batchNumber?: string;
    transaction?: string[];
    remark?: string;
  } = {
    status,
  };
  if (selectedAll) {
    summaryDate.batchNumber = batchNumber;
  } else {
    summaryDate.transaction = selectedTransaction;
  }
  if (rejectRemark) {
    summaryDate.remark = rejectRemark;
  }
  return summaryDate;
};
