import type { ReactNode } from 'react';
import LabelValueList from '../../../../../components/common/LabelValueList';
import TransactionNumber from '../../../../../components/common/TransactionNumber';
import { convertAge, formatDay } from '../../../../../utils/format-day';
import ComponentStatus from '../ComponentStatus';
export interface TransactionDetailData {
  status?: string;
  inputDateTime?: string;
  firstName?: string;
  sureName?: string;
  telNo?: string;
  dateOfBirth?: string;
  nation?: string;
  nicPassport?: string;
  physicalCard?: boolean | string;
  inputCompany?: string;
  inputBranch?: string;
  policyName?: string;
  inputter?: string;
  transactionNumber?: string;
  gender?: string;
  remark?: string;
  productName?: string;
  projectName?: string;
  deleted?: boolean;
  customerId?: string;
  parentId?: string;
  openingDate?: string;
}
interface TransactionDetailProps extends TransactionDetailData {
  children?: ReactNode;
}
const TransactionDetail = ({
  status,
  inputDateTime,
  firstName,
  sureName,
  telNo,
  dateOfBirth,
  nation,
  nicPassport,
  physicalCard,
  inputCompany,
  inputBranch,
  policyName,
  inputter,
  transactionNumber,
  gender,
  remark,
  productName,
  projectName,
  deleted,
  customerId,
  parentId,
  openingDate,
  children,
}: TransactionDetailProps) => {
  const topSection = [
    {
      label: 'Status',
      value: <ComponentStatus deleted={deleted} status={status} />,
    },
    {
      label: 'Transaction Date/Time',
      value: formatDay(inputDateTime),
    },
  ];

  const personalInfoSection = [
    {
      label: 'Name',
      value: `${sureName} ${firstName}`,
    },
    {
      label: 'Gender',
      value: gender,
    },
    {
      label: 'Tel No.',
      value: telNo,
    },
    {
      label: 'Date of Birth',
      value: formatDay(dateOfBirth, 'DD/MMM/YYYY'),
    },
    {
      label: 'Nationality',
      value: nation,
    },
    {
      label: 'NIC/Passport',
      value: nicPassport,
    },
    {
      label: 'Parent ID',
      value: parentId,
    },
    {
      label: 'Children ID',
      value: customerId,
    },
    {
      label: 'Physical Card',
      value:
        (typeof physicalCard === 'boolean' && physicalCard) ||
        physicalCard === 'true'
          ? 'Yes'
          : 'No',
    },
    {
      label: 'Project',
      value: projectName,
    },
    {
      label: 'Opening Date',
      value: formatDay(openingDate, 'DD/MMM/YYYY'),
    },
    {
      label: 'Age',
      value: convertAge(dateOfBirth),
    },
  ];

  const bottomSectionInfo = [
    {
      label: 'Product',
      value: productName,
    },
    {
      label: 'Company Name',
      value: inputCompany,
    },
    {
      label: 'Policy Name',
      value: policyName,
    },
    {
      label: 'Branch',
      value: inputBranch,
    },
    {
      label: 'Data Inputed',
      value: inputter,
    },
  ];

  return (
    <div>
      <div className="px-3 mb-1">
        <div className="row">
          <div className="col-6">
            {!!transactionNumber && (
              <TransactionNumber transactionNumber={transactionNumber} />
            )}
          </div>
          <div className="col-6"></div>
        </div>
        {!!status && <LabelValueList list={topSection} />}
      </div>
      {remark && (
        <div className="alert alert-danger" role="alert">
          <h5 className="alert-heading">
            {deleted ? 'Endorsement to Deleted' : 'Rejected'} Remark
          </h5>
          <p>{remark}</p>
        </div>
      )}
      <div className="bg-light-gray rounded px-3 py-1 mb-2">
        <LabelValueList list={personalInfoSection} />
      </div>
      <div className="bg-light-gray rounded px-3 py-1">
        <LabelValueList
          list={bottomSectionInfo}
          valueColorClassName="text-primary"
        />
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
};
export default TransactionDetail;
