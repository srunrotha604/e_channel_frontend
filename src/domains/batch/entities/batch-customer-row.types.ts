export interface BatchCustomerRow {
  rowNumber?: number;
  surName?: string;
  firstName?: string;
  gender?: string;
  telNo?: string;
  dateOfBirth?: string;
  nicPassport?: string;
  parentId?: string;
  customerId?: string;
  nation?: string;
  physicalCard?: string;
  openingDate?: string;
}
export interface BatchCustomerListResult {
  list?: BatchCustomerRow[];
  existingList?: BatchCustomerRow[];
  duplicateList?: BatchCustomerRow[];
  errorList?: BatchCustomerRow[];
  totalRecord?: number;
  totalExistingRecord?: number;
  totalDuplicateRecord?: number;
  totalErrorRecord?: number;
  message?: string;
}
