export interface BatchDetailInfo {
  batchNumber?: string;
  inputDateTime?: string;
  projectName?: string;
  productName?: string;
  policies?: string;
  inputCompany?: string;
  inputBranch?: string;
  inputter?: string;
}
export interface BatchDetail {
  details?: BatchDetailInfo;
  totalDocs?: number;
}
