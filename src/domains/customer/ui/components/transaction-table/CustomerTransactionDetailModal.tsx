import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import Modal from '../../../../../components/common/modal';
import TransactionDetail, {
  type TransactionDetailData,
} from './CustomerTransactionDetail';
interface TransactionDetailModalProps {
  data?: TransactionDetailData | null;
  actions?: ReactNode;
  children?: ReactNode;
}
const TransactionDetailModal = forwardRef<
  HTMLDivElement,
  TransactionDetailModalProps
>(function TransactionDetailModal({ data, actions, children }, ref) {
  const {
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
    inputter,
    transactionNumber,
    productName,
    gender,
    remark,
    projectName,
    deleted,
    policyName,
    customerId,
    openingDate,
    parentId,
  } = data || {};

  return (
    <Modal
      size="lg"
      title={'Transaction Detail'}
      ref={ref}
      bodyClassName="px-3 py-2 pb-3"
      headerClassName="px-4"
      actions={actions}
    >
      <TransactionDetail
        transactionNumber={transactionNumber}
        status={status}
        inputDateTime={inputDateTime}
        firstName={firstName}
        sureName={sureName}
        telNo={telNo}
        dateOfBirth={dateOfBirth}
        nation={nation}
        nicPassport={nicPassport}
        physicalCard={physicalCard}
        remark={remark}
        inputCompany={inputCompany}
        inputBranch={inputBranch}
        inputter={inputter}
        productName={productName}
        gender={gender}
        projectName={projectName}
        deleted={deleted}
        customerId={customerId}
        parentId={parentId}
        policyName={policyName}
        openingDate={openingDate}
      >
        {children}
      </TransactionDetail>
    </Modal>
  );
});
export default TransactionDetailModal;
