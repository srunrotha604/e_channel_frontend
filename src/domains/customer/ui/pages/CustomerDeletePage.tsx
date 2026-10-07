import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApproveRejectConfirmationModal from '../../../../components/common/ActionConfirmationModal';
import Button from '../../../../components/common/Button';
import Checkbox from '../../../../components/common/Checkbox';
import { useModal } from '../../../../components/common/modal';
import Spinner, { useSpinner } from '../../../../components/common/Spinner';
import TransactionNumberTableItem from '../../../../components/transaction/TransactionNumberTableItem';
import TransactionTable, {
  type TransactionTabListHandle,
} from '../../../../components/transaction/TransactionTable';
import { useAuth } from '../../../../context/AuthContext';
import useLoading from '../../../../hooks/useLoading';
import useMessage from '../../../../hooks/useMessage';
import { delay } from '../../../../utils/delay';
import { pluralize } from '../../../../utils/pluralize';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { CustomerTransaction } from '../../entities';
import { STATUS } from '../../entities';
import {
  deleteCustomerTransactions,
  fetchCustomerTransactionList,
  useTransactionTabSelect,
} from '../../interface-adapters';
import type { ActionItem } from '../../use-cases';
import { mapCustomerTransaction } from '../../use-cases';
import CustomerBatchProcessModal from '../components/transaction-table/CustomerBatchProcessModal';
import { TransactionLogsModal } from '../components/transaction-table/CustomerTransactionLogs';
import CustomerTransactionSelect from '../components/transaction-table/CustomerTransactionSelect';
import { CustomerDetailModal } from '../components/transaction-table/CustomerTransactionTable';
const CustomerDeletePage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { key } = useParams();
  const { hasPermissionProccessTransaction } = useAuth();
  const navigate = useNavigate();
  const tabListRef = useRef<TransactionTabListHandle | null>(null);

  const {
    handleSelectTransaction,
    handleRemoveCustomerFromList,
    handleSelectAllInCurrentList,
    resetSelectedTransaction,
    isSelectedAllInCurrentList,
    isSelectedItem,
    selectedTransaction,
    resetSelected,
    selectedAll,
    setSelectedAll,
    selectedCustomerList,
    setSelectedCustomerList,
  } = useTransactionTabSelect();
  const { closeModal, openModal, modalRef, open } = useModal();
  const {
    closeModal: closeActionModal,
    openModal: openActionModal,
    modalRef: actionModalRef,
  } = useModal();
  const [isApprove, setIsApprove] = useState<boolean | null>(null);
  const [processStatus, setProccessStatus] = useState<string | null>(null);
  const [totalDocs, setTotalDocs] = useState<number | null>(null);
  const [currentTabStatus, setCurrentTabStatus] = useState<string | null>(null);
  const getSelectedCustomerList = async () => {
    try {
      const response = selectedAll
        ? await fetchCustomerTransactionList({
            status: currentTabStatus,
            pageSize: totalDocs,
          })
        : await fetchCustomerTransactionList({
            transaction: selectedTransaction.join(','),
            pageSize: selectedTransaction.length,
          });
      setSelectedCustomerList(response?.list ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    navigate(ROUTE_PATH.dashboard);
  };

  const handleProcess = async (rejectRemark?: string) => {
    try {
      closeActionModal();
      openSpinner({ title: 'Processing...' });
      const summaryDate: {
        status: string | null;
        batchNumber?: string;
        transaction?: string[];
        remark?: string;
      } = {
        status: processStatus,
      };

      if (selectedAll) {
        summaryDate.batchNumber = key;
      } else {
        summaryDate.transaction = selectedTransaction;
      }

      if (rejectRemark) {
        summaryDate.remark = rejectRemark;
      }

      await deleteCustomerTransactions(summaryDate);

      toast.success(
        `${selectedCustomerList.length} ${pluralize(
          'transaction',
          selectedCustomerList.length
        )} has been ${processStatus}!`
      );
      closeModal();
      tabListRef.current?.getList();
      resetSelected();
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) ? error.response?.data?.message : undefined
      );
    } finally {
      delay(closeSpinner);
    }
  };
  useEffect(() => {
    if (open && selectedCustomerList.length <= 0) {
      closeModal();
      resetSelected();
    }
  }, [selectedCustomerList]);

  const [processLoading, startProcessLoading, stopProcessLoading] =
    useLoading();
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const { showErrorResponseMessage } = useMessage();
  const handleProcessSelected = async () => {
    try {
      openSpinner();
      startProcessLoading();
      await getSelectedCustomerList();
      openModal();
    } catch (error) {
      showErrorResponseMessage(error);
    } finally {
      stopProcessLoading();
      delay(closeSpinner);
    }
  };

  return (
    <div className="page-wrapper full-height-dashboard-container-fixed container-xl">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          className="mb-2"
          style={{
            flexGrow: 1,
            height: '0px',
            overflow: 'auto',
            display: 'flex',
          }}
        >
          <TransactionTable<CustomerTransaction>
            title={<h2 className="mb-0">Customer List</h2>}
            onRowClick={handleSelectTransaction}
            ref={tabListRef}
            DetailModal={CustomerDetailModal}
            LogsModal={TransactionLogsModal}
            mapItem={mapCustomerTransaction}
            onFetchSuccess={({
              data,
              tabStatus,
            }: {
              data?: { totalDocs?: number };
              tabStatus: string;
            }) => {
              setTotalDocs(data?.totalDocs ?? null);
              setCurrentTabStatus(tabStatus);
            }}
            extraParams="type=Single,Batch"
            typeFilter={false}
            path={location.pathname}
            defaultTab={STATUS.Confirmed}
            onTabChange={resetSelectedTransaction}
            renderExtraFilter={() => {
              return (
                <div
                  style={{ flex: 1 }}
                  className="btn-list mx-2 align-items-center"
                >
                  <CustomerTransactionSelect
                    disableSelectAll
                    isSelectedAll={selectedAll}
                    onClearSelect={resetSelectedTransaction}
                    onSelectAll={setSelectedAll}
                    totalSelected={selectedTransaction?.length}
                    onClick={handleProcessSelected}
                  />
                </div>
              );
            }}
            renderTableHead={(transactionList: CustomerTransaction[]) => {
              return (
                <>
                  <th className="p-0">
                    <label
                      style={{ padding: '12px 12px 12px 24px' }}
                      className="w-100 cursor-pointer"
                    >
                      <Checkbox
                        disableGutter
                        checked={isSelectedAllInCurrentList(transactionList)}
                        onChange={(checked: boolean) => {
                          handleSelectAllInCurrentList(
                            checked,
                            transactionList
                          );
                        }}
                      />
                    </label>
                  </th>
                  <th>TRANSACTION</th>
                  <th>Name</th>
                  <th>PROJECT</th>
                  <th>PRODUCT</th>
                  <th>USER</th>
                  <th>BRANCH</th>
                </>
              );
            }}
            renderTableBody={({
              item,
              handleShowTransactionDetail,
            }: {
              item: CustomerTransaction;
              handleShowTransactionDetail: (item: CustomerTransaction) => void;
            }) => {
              return (
                <>
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
                        checked={isSelectedItem(item)}
                        onChange={() => {
                          handleSelectTransaction(item);
                        }}
                      />
                    </label>
                  </td>
                  <td
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
                    {item.inputter}
                  </td>
                  <td className="text-muted transaction-table-cell-muted">
                    {item.inputBranch}
                  </td>
                </>
              );
            }}
          />
        </div>
        <div className="btn-list">
          <Button variant="secondary" onClick={goBack}>
            Back
          </Button>
          <Button
            disabled={
              (!selectedAll && selectedTransaction.length === 0) ||
              processLoading
            }
            onClick={handleProcessSelected}
            loading={processLoading}
            loadingText="Processing..."
          >
            Process Selected
          </Button>
          <div>
            <ApproveRejectConfirmationModal
              key={selectedTransaction?.join(',')}
              closeModal={closeActionModal}
              modalRef={actionModalRef}
              isApprove={isApprove}
              confirmMessageText={getConfirmedMessageText({
                status: processStatus,
                selectedCustomerList,
              })}
              onApprove={handleProcess}
              onReject={handleProcess}
            />
            <CustomerBatchProcessModal
              data={{
                selectedCustomerList,
                tabStatus: searchParams.get('status'),
              }}
              handleRemoveCustomer={handleRemoveCustomerFromList}
              closeModal={closeModal}
              ref={modalRef}
              actions={actions[
                searchParams.get('status') ?? STATUS.Confirmed
              ]?.map(
                (action) =>
                  hasPermissionProccessTransaction(action.action) && (
                    <Button
                      variant={action.reject ? 'danger' : 'primary'}
                      key={action.status}
                      onClick={() => {
                        setIsApprove(action.confirm ?? false);
                        setProccessStatus(action.status);
                        openActionModal();
                      }}
                    >
                      {action.label}
                    </Button>
                  )
              )}
            />
            <Spinner {...spinnerState} />
          </div>
        </div>
      </div>
    </div>
  );
};

const actions: Record<string, ActionItem[]> = {
  Confirmed: [
    { action: 'submitted', status: 'Submitted', label: 'Delete', reject: true },
  ],
};

const getConfirmedMessageText = ({
  status,
  selectedCustomerList,
}: {
  status: string | null;
  selectedCustomerList: CustomerTransaction[];
}) => {
  const tempStatus: Record<string, string> = {
    Submitted: 'delete',
  };

  const proccessStatus = (status && tempStatus[status]) ?? 'delete';

  return (
    <p className="fs-4">
      Are you sure you want to <b>{proccessStatus}</b>{' '}
      {`${selectedCustomerList.length > 1 ? 'these' : 'this'}`}{' '}
      <b>
        {selectedCustomerList.length > 0 ? selectedCustomerList.length : ''}
      </b>
      {pluralize('transaction', selectedCustomerList?.length)}?
    </p>
  );
};

export default CustomerDeletePage;
