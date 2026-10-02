export interface TransactionTotalCounts {
  total?: number;
  draft?: number;
  submitted?: number;
  approved?: number;
  bmReject?: number;
  confirmed?: number;
  driReject?: number;
  accepted?: number;
  confirmedDeleted?: number;
}
export interface CustomerListResponse {
  list?: CustomerTransaction[];
  total?: TransactionTotalCounts[];
  totalDocs?: number;
}
export type CustomerTransactionRaw = Omit<
  CustomerTransaction,
  'transactionCode' | 'transactionNumber' | 'dateOfBirth' | 'deleted'
> & {
  transationCode?: string;
  transationNumber?: string;
  dateofBirth?: string;
  deleted?: boolean | string;
};
export interface CustomerRawListResponse {
  list?: CustomerTransactionRaw[];
  total?: TransactionTotalCounts[];
  totalDocs?: number;
}
export interface CustomerTransaction {
  transactionCode?: string;
  transactionNumber?: string;
  batchNumber?: string;
  coreProductCode?: string;
  uuid?: string;
  sureName?: string;
  firstName?: string;
  telNo?: string;
  gender?: string;
  nation?: string;
  nicPassport?: string;
  dateOfBirth?: string;
  physicalCard?: boolean | string;
  deleted?: boolean;
  status?: string;
  projectCode?: string;
  projectName?: string;
  productCode?: string;
  productName?: string;
  policyName?: string;
  policies?: string;
  inputter?: string;
  inputBranch?: string;
  inputCompany?: string;
  inputDateTime?: string;
  remark?: string;
  customerId?: string;
  parentId?: string;
  openingDate?: string;
  customerCardConfirmation?: {
    status?: string;
    cardNumber?: string;
  };
  customerIssueDate?: {
    cardNumber?: string;
    issueDate?: string;
    status?: string;
    remark?: string;
    secureCode?: string;
  };
}
