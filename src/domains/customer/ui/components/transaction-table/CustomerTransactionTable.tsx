import clsx from 'clsx';
import type { ForwardedRef, MouseEvent, ReactNode } from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SelectOptionList } from '../../../../../@type/report';
import IssueDateDetailModal from '../../../../../components/IssueDateDetailModal';
import IssueDateModal from '../../../../../components/IssueDateModal';
import Checkbox from '../../../../../components/common/Checkbox';
import { useModal } from '../../../../../components/common/modal';
import TransactionNumberTableItem from '../../../../../components/transaction/TransactionNumberTableItem';
import TransactionTable, {
  type TransactionTabItem,
  type TransactionTabListHandle,
} from '../../../../../components/transaction/TransactionTable';
import { useAuth } from '../../../../../context/AuthContext';
import { formatDay } from '../../../../../utils/format-day';
import { ROUTE_PATH } from '../../../../../utils/route-util';
import type { CustomerTransaction } from '../../../entities';
import { STATUS, typeOptions } from '../../../entities';
import { mapCustomerTransaction } from '../../../use-cases';
import ComponentStatus from '../ComponentStatus';
import CustomerTransactionDetailModal from './CustomerTransactionDetailModal';
import {
  ShowLogsButton,
  TransactionLogsModal,
} from './CustomerTransactionLogs';

export const CustomerDetailModal = forwardRef<
  HTMLDivElement,
  { data: CustomerTransaction; onShowLogs: () => void }
>(function CustomerDetailModal({ data, onShowLogs }, ref) {
  return (
    <CustomerTransactionDetailModal data={data} ref={ref}>
      <ShowLogsButton onClick={onShowLogs} />
    </CustomerTransactionDetailModal>
  );
});

interface CustomerTransactionTableProps {
  title?: ReactNode;
  tab?: TransactionTabItem[];
  branchFilter?: boolean;
  path?: string;
  url?: string;
  extraParams?: string;
  renderExtraFilter?: (args: {
    tabStatus: string;
    total?: Record<string, number | undefined>;
    totalDocs?: number | null;
  }) => ReactNode;
  onTabChange?: (status: string) => void;
  defaultTab?: string;
  onFetchSuccess?: (payload: {
    data?: {
      list?: CustomerTransaction[];
      total?: Record<string, number | undefined>[];
      totalDocs?: number;
    };
    tabStatus: string;
  }) => void;
  onFetchFail?: (payload: { tabStatus: string }) => void;
  disableRowClick?: boolean;
  typeFilter?: boolean | ((args: { tabStatus: string }) => boolean);
  isSelectedAllInCurrentList?: (list: CustomerTransaction[]) => boolean;
  handleSelectAllInCurrentList?: (
    checked: boolean,
    list: CustomerTransaction[]
  ) => void;
  handleSelectItem?: (item: CustomerTransaction) => void;
  isSelectedItem?: (item: CustomerTransaction) => boolean;
  enableCheckbox?: boolean | ((args: { tabStatus: string }) => boolean);
}

const CustomerTransactionTable = (
  {
    isSelectedAllInCurrentList,
    handleSelectAllInCurrentList,
    handleSelectItem,
    isSelectedItem,
    enableCheckbox = false,
    ...rest
  }: CustomerTransactionTableProps,
  ref: ForwardedRef<TransactionTabListHandle>
) => {
  const navigate = useNavigate();
  const { hasPermissionProccessTransaction } = useAuth();
  const innerRef = useRef<TransactionTabListHandle>(null);

  useImperativeHandle(ref, () => ({
    getList: () => innerRef.current?.getList(),
  }));

  const navigateToDetailPage = (transactionCode?: string) => {
    navigate(ROUTE_PATH.customerTransaction(transactionCode ?? ''));
  };

  const processTransaction = (
    status: string | string[],
    item: CustomerTransaction
  ) => {
    if (hasPermissionProccessTransaction(status)) {
      navigateToDetailPage(item.transactionCode);
    }
  };

  const handleRecordClick = (item: CustomerTransaction) => {
    switch (item.status) {
      case STATUS.Submitted:
        processTransaction(['approved', 'bmRejected'], item);
        break;
      case STATUS.Draft:
        if (hasPermissionProccessTransaction(['draft', 'submitted'])) {
          navigate(
            ROUTE_PATH.customerEdit(
              item.transactionCode ?? '',
              item.productCode ?? ''
            )
          );
        }
        break;
      case STATUS.Approved:
        processTransaction(['confirmed', 'driRejected'], item);
        break;
      case STATUS.BM_Rejected:
        processTransaction('draft', item);
        break;
      case STATUS.Confirmed:
      case STATUS.DRI_Rejected:
        navigateToDetailPage(item.transactionCode);
        break;
      default:
        navigate(ROUTE_PATH.error404);
    }
  };

  const {
    modalRef: issueDateModalRef,
    open: isIssueDateModalOpen,
    openModal: openIssueDateModal,
    closeModal: closeIssueDateModal,
    data: issueDateItem,
  } = useModal<CustomerTransaction>();

  const {
    modalRef: issueDateDetailModalRef,
    open: isIssueDateDetailModalOpen,
    openModal: openIssueDateDetailModal,
    closeModal: closeIssueDateDetailModal,
    data: issueDateDetailItem,
  } = useModal<CustomerTransaction>();

  const [, setStatusMap] = useState<Record<string, string | undefined>>({});

  const handleIssueDateClick = async (
    e: MouseEvent,
    item?: CustomerTransaction
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!item) return;

    const status = item?.customerCardConfirmation?.status;

    setStatusMap((prev) => ({
      ...prev,
      [item.uuid ?? '']: status,
    }));

    if (status === 'green') {
      openIssueDateDetailModal(item);
    } else {
      openIssueDateModal(item);
    }
  };

  const refreshCardStatus = () => {
    innerRef.current?.getList();
  };

  const isEnableCheckbox =
    typeof enableCheckbox === 'function'
      ? (tabStatus: string) => enableCheckbox({ tabStatus })
      : () => enableCheckbox;

  return (
    <>
      <TransactionTable<CustomerTransaction>
        {...rest}
        ref={innerRef}
        onRowClick={handleRecordClick}
        typeOptions={typeOptions as SelectOptionList[]}
        DetailModal={CustomerDetailModal}
        LogsModal={TransactionLogsModal}
        mapItem={mapCustomerTransaction}
        renderTableHead={(transactionList, tabStatus) => (
          <>
            {isEnableCheckbox(tabStatus) && (
              <th className="p-0">
                <label
                  style={{ padding: '12px 12px 12px 24px' }}
                  className="w-100 cursor-pointer"
                >
                  <Checkbox
                    disableGutter
                    checked={
                      !!isSelectedAllInCurrentList &&
                      isSelectedAllInCurrentList(transactionList)
                    }
                    onChange={(checked) => {
                      handleSelectAllInCurrentList &&
                        handleSelectAllInCurrentList(checked, transactionList);
                    }}
                  />
                </label>
              </th>
            )}
            <th>TRANSACTION</th>
            <th>BATCH No.</th>
            <th>INSURED NAME</th>
            <th>PROJECT</th>
            <th>PRODUCT</th>
            <th>DATE</th>
            <th>USER</th>
            <th>BRANCH</th>
            <th>DATE OF ISSUE CARD</th>
            <th style={{ width: '10%' }}>STATUS</th>
          </>
        )}
        renderTableBody={({ item, handleShowTransactionDetail, tabStatus }) => {
          const isCompleted =
            item?.customerCardConfirmation?.status === 'green';
          const hasIssueDate = !!item?.customerIssueDate?.issueDate;
          const isDisabled = !isCompleted && !hasIssueDate;

          return (
            <>
              {isEnableCheckbox(tabStatus) && (
                <td
                  className="p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <label
                    style={{ padding: '12px 12px 12px 24px' }}
                    className="w-100 cursor-pointer"
                  >
                    <Checkbox
                      disableGutter
                      checked={!!isSelectedItem && isSelectedItem(item)}
                      onChange={() => {
                        handleSelectItem && handleSelectItem(item);
                      }}
                    />
                  </label>
                </td>
              )}
              <td
                className="text-primary"
                title={'Click to view transaction detail'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowTransactionDetail(item);
                }}
              >
                <TransactionNumberTableItem
                  transactionNumber={item.transactionNumber}
                />
              </td>
              <td
                className={clsx({
                  'text-underline': item.batchNumber,
                  'text-secondary': item.batchNumber,
                })}
                title={
                  item.batchNumber
                    ? 'Click to process batch transaction'
                    : undefined
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (!item.batchNumber) return handleRecordClick(item);
                  navigate(ROUTE_PATH.customerBatch(item.batchNumber));
                }}
              >
                {item?.batchNumber || 'N/A'}
              </td>
              <td className="text-muted transaction-table-cell-muted">
                {item.sureName + ' ' + item.firstName}
              </td>
              <td className="text-muted transaction-table-cell-muted">
                {item.projectName}
              </td>
              <td className="text-muted transaction-table-cell-muted">
                {item.productCode}
              </td>
              <td className="text-muted transaction-table-cell-muted">
                {formatDay(item.inputDateTime)}
              </td>
              <td className="text-muted transaction-table-cell-muted">
                {item.inputter}
              </td>
              <td className="text-muted transaction-table-cell-muted">
                {item.inputBranch}
              </td>
              <td className="text-muted transaction-table-cell-muted text-center">
                <button
                  type="button"
                  onClick={(e) => {
                    if (isDisabled) return;
                    handleIssueDateClick(e, item);
                  }}
                  disabled={isDisabled}
                  className={`issue_btn_status issue-status-btn btn ${
                    isCompleted
                      ? 'btn-outline-success'
                      : hasIssueDate
                      ? 'btn-outline-info'
                      : 'btn-outline-warning'
                  }`}
                  title={isDisabled ? 'Not Yet Issue' : 'Open'}
                >
                  {isCompleted
                    ? 'Completed'
                    : item.customerIssueDate?.issueDate
                    ? new Date(
                        item.customerIssueDate.issueDate
                      ).toLocaleDateString('en-GB')
                    : 'Not Yet Issue'}
                </button>
              </td>
              <td className={clsx('text-bold', 'text-underline')}>
                <ComponentStatus deleted={item.deleted} status={item.status} />
              </td>
            </>
          );
        }}
      />

      <IssueDateModal
        open={isIssueDateModalOpen}
        closeModal={closeIssueDateModal}
        modalRef={issueDateModalRef}
        item={issueDateItem}
        onUpdate={refreshCardStatus}
      />

      <IssueDateDetailModal
        open={isIssueDateDetailModalOpen}
        onClose={closeIssueDateDetailModal}
        modalRef={issueDateDetailModalRef}
        item={issueDateDetailItem}
      />
    </>
  );
};

export default forwardRef(CustomerTransactionTable);
