import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApproveRejectConfirmationModal from '../../../../components/common/ActionConfirmationModal';
import Button from '../../../../components/common/Button';
import Checkbox from '../../../../components/common/Checkbox';
import LabelValueList from '../../../../components/common/LabelValueList';
import { useModal } from '../../../../components/common/modal/index';
import Spinner, { useSpinner } from '../../../../components/common/Spinner';
import TransactionNumber from '../../../../components/common/TransactionNumber';
import TransactionNumberTableItem from '../../../../components/transaction/TransactionNumberTableItem';
import TransactionTable, {
  type TransactionTabListHandle,
} from '../../../../components/transaction/TransactionTable';
import { useAuth } from '../../../../context/AuthContext';
import useLoading from '../../../../hooks/useLoading';
import useMessage from '../../../../hooks/useMessage';
import { delay } from '../../../../utils/delay';
import { formatDay } from '../../../../utils/format-day';
import { pluralize } from '../../../../utils/pluralize';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  CustomerTransaction,
  TransactionTotalCounts,
} from '../../../customer/entities';
import { STATUS } from '../../../customer/entities';
import {
  fetchCustomerTransactionList,
  useTransactionTabSelect,
} from '../../../customer/interface-adapters';
import CustomerBatchProcessModal from '../../../customer/ui/components/transaction-table/CustomerBatchProcessModal';
import { TransactionLogsModal } from '../../../customer/ui/components/transaction-table/CustomerTransactionLogs';
import CustomerTransactionSelect from '../../../customer/ui/components/transaction-table/CustomerTransactionSelect';
import { CustomerDetailModal } from '../../../customer/ui/components/transaction-table/CustomerTransactionTable';
import { mapCustomerTransaction } from '../../../customer/use-cases';
import { getConfirmedMessageText } from '../../../customer/use-cases/get-confirm-message-text';
import { actions } from '../../../customer/use-cases/workflow-actions';
import type { BatchDetail, BatchDetailInfo } from '../../entities';
import {
  fetchBatchTransactionList,
  processBatchTransactions,
} from '../../interface-adapters';
import { buildBatchProcessDto } from '../../use-cases';
const BatchDetailPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { key } = useParams();
  const { hasPermissionAccessTransaction, hasPermissionProccessTransaction } =
    useAuth();
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
  const [batchDetail, setBatchDetail] = useState<BatchDetail | null>(null);
  const [currentTabStatus, setCurrentTabStatus] = useState<string | null>(null);
  const { openSpinner, closeSpinner, spinnerState } = useSpinner();
  const navTab = useMemo(() => {
    return [
      {
        label: STATUS.Draft,
        status: STATUS.Draft,
        getTotal: (total?: TransactionTotalCounts) => total?.draft,
        hidden: !hasPermissionAccessTransaction('draft'),
      },
      {
        label: STATUS.Submitted,
        status: STATUS.Submitted,
        getTotal: (total?: TransactionTotalCounts) => total?.submitted,
        hidden: !hasPermissionAccessTransaction('submitted'),
      },
      {
        label: STATUS.Approved,
        status: STATUS.Approved,
        getTotal: (total?: TransactionTotalCounts) => total?.approved,
        hidden: !hasPermissionAccessTransaction('approved'),
      },
      {
        label: STATUS.BM_Rejected,
        status: STATUS.BM_Rejected,
        getTotal: (total?: TransactionTotalCounts) => total?.bmReject,
        hidden: !hasPermissionAccessTransaction('bmRejected'),
      },
      {
        label: STATUS.Confirmed,
        status: STATUS.Confirmed,
        getTotal: (total?: TransactionTotalCounts) => total?.confirmed,
        hidden: !hasPermissionAccessTransaction('confirmed'),
      },
      {
        label: STATUS.DRI_Rejected,
        status: STATUS.DRI_Rejected,
        getTotal: (total?: TransactionTotalCounts) => total?.driReject,
        hidden: !hasPermissionAccessTransaction('driRejected'),
      },
    ].filter((item) => !item.hidden);
  }, [hasPermissionAccessTransaction]);
  const getSelectedCustomerList = async () => {
    try {
      const response = selectedAll
        ? await fetchBatchTransactionList(key ?? '', {
            status: currentTabStatus,
            pageSize: batchDetail?.totalDocs,
          })
        : await fetchCustomerTransactionList({
            transaction: selectedTransaction.join(','),
            pageSize: selectedTransaction.length,
          });
      setSelectedCustomerList(response?.list ?? []);
      return response?.list;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const details = batchDetail?.details;
  const listDetail = [
    {
      label: 'Project',
      value: details?.projectName,
    },
    {
      label: 'Product',
      value: details?.productName,
    },
    {
      label: 'Policy No.',
      value: details?.policies,
    },
    {
      label: 'Company Name',
      value: details?.inputCompany,
    },
    {
      label: 'Branch',
      value: details?.inputBranch,
    },
    {
      label: 'Data Inputed',
      value: details?.inputter,
    },
  ];
  const goBack = () => {
    navigate(-1);
  };
  const handleProcess = async (rejectRemark?: string) => {
    try {
      openSpinner();
      const summaryDate = buildBatchProcessDto({
        status: processStatus,
        batchNumber: key,
        selectedAll,
        selectedTransaction,
        rejectRemark,
      });
      await processBatchTransactions(summaryDate);
      toast.success(
        `${selectedCustomerList.length} ${pluralize(
          'transaction',
          selectedCustomerList.length
        )} has been ${processStatus}!`
      );
      closeActionModal();
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
  useEffect(() => {
    openSpinner();
  }, []);
  const [processLoading, startProcessLoading, stopProcessLoading] =
    useLoading();
  const { showErrorResponseMessage } = useMessage();
  const handleProcessSelected = async () => {
    try {
      openSpinner();
      startProcessLoading();
      const customer = await getSelectedCustomerList();
      if ((customer?.length ?? 0) <= 0) return;
      delay([closeSpinner, openModal]);
    } catch (error) {
      showErrorResponseMessage(error);
      delay(closeSpinner);
    } finally {
      stopProcessLoading();
    }
  };
  const hasAction =
    currentTabStatus && actions[currentTabStatus]
      ? actions[currentTabStatus].some((action) =>
          hasPermissionProccessTransaction(action.action)
        )
      : false;
  return (
    <div className="page-wrapper container-xl batch-detail-container">
      <div
        className="overflow-hidden mt-3 mb-1"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <div className="card">
          <div className="card-header py-2 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
            <div className="d-flex align-items-center">
              <h3 className="mb-0">Batch Detail </h3>
              <div className="mx-2">
                <TransactionNumber
                  label="Batch Number"
                  disableGutter
                  disableLabel
                  transactionNumber={batchDetail?.details?.batchNumber}
                />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <p className="mb-0">Date</p>
              <div className="mx-2 text-primary-blue ">
                <b>{formatDay(batchDetail?.details?.inputDateTime)}</b>
              </div>
            </div>
          </div>
          <div className="card-body py-2">
            <LabelValueList list={listDetail} columnClassName="col-md-4" />
          </div>
        </div>
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
            tab={navTab}
            onRowClick={handleSelectTransaction}
            ref={tabListRef}
            DetailModal={CustomerDetailModal}
            LogsModal={TransactionLogsModal}
            mapItem={mapCustomerTransaction}
            url={`${ROUTE_API.operationCustomerBatch}/`}
            extraParams={`batchNumber=${key}`}
            onFetchSuccess={({
              data,
              tabStatus,
            }: {
              data?: { details?: BatchDetailInfo; totalDocs?: number };
              tabStatus: string;
            }) => {
              setBatchDetail(data ?? null);
              setCurrentTabStatus(tabStatus);
              delay(closeSpinner);
            }}
            onFetchFail={() => {
              closeSpinner();
            }}
            typeFilter={false}
            path={location.pathname}
            branchFilter={false}
            defaultTab={navTab?.[0]?.status || STATUS.Submitted}
            onTabChange={resetSelectedTransaction}
            renderExtraFilter={() => {
              return (
                <div
                  style={{ flex: 1 }}
                  className="btn-list mx-2 align-items-center"
                >
                  {hasAction && (
                    <CustomerTransactionSelect
                      isSelectedAll={selectedAll}
                      onClearSelect={resetSelectedTransaction}
                      onSelectAll={setSelectedAll}
                      totalSelected={selectedTransaction?.length}
                      onClick={handleProcessSelected}
                    />
                  )}
                </div>
              );
            }}
            renderTableHead={(transactionList) => {
              return (
                <>
                  {hasAction && (
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
                  )}
                  <th>TRANSACTION</th>
                  <th>Name</th>
                  <th>Tel No.</th>
                  <th>Gender</th>
                  <th>Nationality</th>
                  <th>NIC/Passport</th>
                </>
              );
            }}
            renderTableBody={({ item, handleShowTransactionDetail }) => {
              return (
                <>
                  {hasAction && (
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
                  <td className="text-muted">
                    {item.sureName + ' ' + item.firstName}
                  </td>
                  <td className="text-muted">{item.telNo}</td>
                  <td className="text-muted">{item.gender}</td>
                  <td className="text-muted">{item.nation}</td>
                  <td className="text-muted">{item.nicPassport}</td>
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
            hidden={!hasAction}
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
              actions={actions[searchParams.get('status') ?? 'Draft']?.map(
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
export default BatchDetailPage;
