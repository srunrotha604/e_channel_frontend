import axios from 'axios';
import clsx from 'clsx';
import type {
  ChangeEvent,
  ForwardedRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ReactPaginate from 'react-paginate';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import Select from 'react-select';
import { useDebouncedCallback } from 'use-debounce';
import type { SelectOptionList } from '../../@type/report';
import '../../assets/style/custom_style.css';
import { useAuth } from '../../context/AuthContext';
import useMessage from '../../hooks/useMessage';
import { HttpUtil } from '../../utils/http-util';
import { ROUTE_API, ROUTE_PATH } from '../../utils/route-util';
import { STORAGE_KEY } from '../../utils/storage-key';
import { useModal } from '../common/modal/index';
import { selectCustomStyles } from '../common/reactSelectStyles';
import Spinner, { useSpinner } from '../common/Spinner';
type TotalCounts = Record<string, number | undefined>;
interface ListResponse<T> {
  list?: T[];
  total?: TotalCounts[];
  totalDocs?: number;
}
interface FetchResultPayload<T> {
  data?: ListResponse<T>;
  tabStatus: string;
}
interface NavigateListParams {
  status?: string;
  branch?: string;
  pageNum?: number;
  rowPerPage?: number;
  search?: string;
  type?: string;
}
export interface TransactionTabItem {
  status?: string;
  type?: string;
  label: string;
  hidden?: boolean;
  getTotal: (total?: TotalCounts) => number | string | undefined;
}
export interface TransactionTabListHandle {
  getList: () => void;
}
interface TransactionLike {
  transactionNumber?: string;
  deleted?: boolean;
}
interface DetailModalRenderProps<T> {
  data: T;
  onShowLogs: () => void;
}
interface LogsModalProps {
  transactionNo?: string;
  open?: boolean;
  onClose: () => void;
  openSpinner: (arg?: { title?: string }) => void;
  closeSpinner: () => void;
}
interface TransactionTableProps<T extends TransactionLike> {
  title?: ReactNode;
  tab?: TransactionTabItem[];
  branchFilter?: boolean;
  renderTableHead: (list: T[], tabStatus: string) => ReactNode;
  renderTableBody: (args: {
    index: number;
    item: T;
    handleShowTransactionDetail: (item: T) => void;
    tabStatus: string;
  }) => ReactNode;
  path?: string;
  url?: string;
  extraParams?: string;
  renderExtraFilter?: (args: {
    tabStatus: string;
    total?: TotalCounts;
    totalDocs?: number | null;
  }) => ReactNode;
  onTabChange?: (status: string) => void;
  defaultTab?: string;
  onFetchSuccess?: (payload: FetchResultPayload<T>) => void;
  onFetchFail?: (payload: FetchResultPayload<T>) => void;
  disableRowClick?: boolean;
  onRowClick: (item: T) => void;
  typeFilter?: boolean | ((args: { tabStatus: string }) => boolean);
  typeOptions?: SelectOptionList[];
  DetailModal: ForwardRefExoticComponent<
    DetailModalRenderProps<T> & RefAttributes<HTMLDivElement>
  >;
  LogsModal: ForwardRefExoticComponent<
    LogsModalProps & RefAttributes<HTMLDivElement>
  >;
  mapItem?: (item: T) => T;
}
const TransactionTableInner = <T extends TransactionLike>(
  {
    title,
    tab,
    branchFilter = true,
    renderTableHead,
    renderTableBody,
    path = ROUTE_PATH.dashboard,
    url = `${ROUTE_API.operationCustomer}`,
    extraParams = '',
    renderExtraFilter,
    onTabChange,
    defaultTab = 'All',
    onFetchSuccess,
    onFetchFail,
    disableRowClick = false,
    onRowClick,
    typeFilter = true,
    typeOptions = [],
    DetailModal,
    LogsModal,
    mapItem,
  }: TransactionTableProps<T>,
  ref: ForwardedRef<TransactionTabListHandle>
) => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { company } = useAuth();
  const [arrCustomer, setArrCustomer] = useState<T[]>([]);
  const [arrDetails, setArrDetails] = useState<T>({} as T);
  const [total, setTotal] = useState<TotalCounts | undefined>(undefined);
  const [totalDocs, setTotalDocs] = useState<number | null>(null);
  const [branch, setBranch] = useState<SelectOptionList[]>([]);
  const { openModal, modalRef } = useModal();
  const [selectedBranch, setSelectedBranch] = useState<
    SelectOptionList | undefined
  >({
    label: 'All',
    value: 'All',
  });
  const [type, setType] = useState<SelectOptionList | undefined>({
    value: 'All',
    label: 'All',
  });
  const [tabStatus, setTabStatus] = useState(defaultTab);
  const navigate = useNavigate();
  const [rowPerPage, setRowPerPage] = useState(25);
  const [pageNum, setPageNum] = useState(1);
  const { showErrorResponseMessage } = useMessage();
  const tableRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const resetTableScroll = (position = 0) => {
    if (tableRef.current) {
      tableRef.current.scrollTop = position;
    }
  };
  const navigateList = (params: NavigateListParams = {}) => {
    navigate(
      {
        pathname: path,
        search: createSearchParams({
          status: params.status ?? tabStatus ?? '',
          branch: params.branch ?? selectedBranch?.value ?? '',
          pageNum: String(params.pageNum ?? pageNum),
          rowPerPage: String(params.rowPerPage ?? rowPerPage),
          search: params.search ?? searchRef.current?.value ?? '',
          type: params.type ?? type?.value ?? '',
        }).toString(),
      },
      { replace: true }
    );
  };
  const getList = async (
    status: string,
    branch: string,
    rowPerPage: number,
    pageNum: number,
    search: string,
    type: string,
    { signal }: { signal?: AbortSignal | null } = { signal: null }
  ) => {
    setLoading(true);
    const listStatus =
      status === 'All' || status.length === -1 ? '' : `${status}`;
    const listBranch =
      branch === 'All' || branch.length === -1 ? '' : `${branch}`;
    const listType = type === 'All' || branch.length === -1 ? '' : `${type}`;
    try {
      const res = await HttpUtil.get<ListResponse<T>>(
        `${url}?${extraParams}&status=${listStatus}&branchName=${listBranch}&pageSize=${rowPerPage}&pageNumber=${pageNum}&search=${search}&${
          typeFilter ? `type=${listType}` : ''
        }`,
        { signal: signal ?? undefined }
      );
      const list = res?.data?.list ?? [];
      setArrCustomer(mapItem ? list.map(mapItem) : list);
      setTotal(res?.data?.total?.[0]);
      const tempTotalDocs = res?.data?.totalDocs;
      setTotalDocs(tempTotalDocs ?? null);
      const totalPage = Math.ceil((tempTotalDocs ?? 0) / rowPerPage);
      if (totalPage > 0 && totalPage < pageNum) {
        navigateList({ pageNum: totalPage });
      }
      onFetchSuccess?.({ data: res?.data, tabStatus: listStatus });
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }
      onFetchFail?.({
        data: (error as { data?: ListResponse<T> })?.data,
        tabStatus: listStatus,
      });
      showErrorResponseMessage(error);
    } finally {
      setLoading(false);
    }
  };
  const getListDetails = async (transactionCode?: string) => {
    try {
      const res = await HttpUtil.get<ListResponse<T>>(
        `${ROUTE_API.operationCustomer}?transactionCode=` + transactionCode
      );
      const item = res?.data?.list?.[0];
      const mapped = item && mapItem ? mapItem(item) : item;
      setArrDetails(mapped ?? ({} as T));
      return mapped;
    } catch (error) {
      showErrorResponseMessage(error);
      return undefined;
    }
  };
  const handleShowTransactionDetail = async (item: T) => {
    const result = await getListDetails(item.transactionNumber);
    if (result) {
      openModal();
    }
  };
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const tabHandleClick = (value: string, type?: string) => {
    navigateList({ status: value, pageNum: 1, type: type ? type : '' });
    setTotalDocs(0);
    onTabChange && onTabChange(value);
  };
  const branchSelectedHandleChange = (data: SelectOptionList | null) => {
    navigateList({ branch: data?.value });
  };
  const handleChangeRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
    const tempRowPerPage = Number(e.target.value);
    setRowPerPage(tempRowPerPage);
    navigateList({ rowPerPage: tempRowPerPage, pageNum: 1 });
  };
  const handleChangePageNum = (e: { selected: number }) => {
    setPageNum(Number(e.selected) + 1);
    navigateList({ pageNum: Number(e.selected) + 1 });
  };
  const handleTypeChange = (data: SelectOptionList | null) => {
    navigateList({ type: data?.value });
  };
  useEffect(() => {
    if (company) {
      const e_chanel_storage = localStorage.getItem(STORAGE_KEY);
      const token_text = e_chanel_storage ? JSON.parse(e_chanel_storage) : null;
      const companyDetails = company?.find(
        (item) => item?.companyCode === token_text?.company
      );
      const tempBranch: SelectOptionList[] = [
        { value: 'All', label: 'All' },
        ...(companyDetails?.branch ?? []).map((item) => ({
          value: item.branchCode,
          label: item.branchName,
        })),
      ];
      setBranch(tempBranch);
      if (searchParams.get('branch')) {
        const branch = searchParams.get('branch');
        setSelectedBranch(tempBranch.find((item) => item.value === branch));
      }
    }
  }, [company]);
  useImperativeHandle(
    ref,
    () => {
      return {
        getList: () => {
          getList(
            tabStatus,
            selectedBranch?.value ?? 'All',
            rowPerPage,
            pageNum,
            searchRef.current?.value ?? '',
            type?.value ?? 'All'
          );
        },
      };
    },
    [tabStatus, selectedBranch, rowPerPage, pageNum, type]
  );
  useEffect(() => {
    let tempStatus = searchParams.get('status') ?? defaultTab;
    let tempBranch = searchParams.get('branch') ?? 'All';
    let tempPageNum = Number(searchParams.get('pageNum') ?? 1);
    let tempRowPerPage = Number(searchParams.get('rowPerPage') ?? 25);
    let tempSearch = searchParams.get('search') ?? '';
    let tempType = searchParams.get('type') || 'All';
    const abortController = new AbortController();
    if (branch.length > 0) {
      setTabStatus(tempStatus);
      setSelectedBranch(branch?.find((item) => item?.value === tempBranch));
      setType(typeOptions.find((item) => item.value === tempType));
      setPageNum(tempPageNum);
      setRowPerPage(tempRowPerPage);
      if (searchRef.current) {
        searchRef.current.value = tempSearch;
      }
      getList(
        tempStatus.replace('_Deleted', ''),
        tempBranch,
        tempRowPerPage,
        tempPageNum,
        tempSearch,
        tempType,
        { signal: abortController.signal }
      );
      resetTableScroll();
    }
  }, [searchParams, branch]);

  const debounceSearch = useDebouncedCallback((value: string) => {
    navigateList({ pageNum: 1, search: value });
  }, 400);
  const {
    modalRef: transactionLogModalRef,
    open: transactionLogModalOpen,
    openModal: openTransactionLogModal,
    closeModal: closeTransactionLogModal,
  } = useModal();
  const isEnableTypeFilter =
    typeof typeFilter === 'function' ? typeFilter({ tabStatus }) : typeFilter;
  return (
    <>
      <div className="page-wrapper">
        <div className="card overflow-hidden mt-3 mb-1" style={{ flex: 1 }}>
          <div className="card-header">
            {tab && tab.length > 0 ? (
              <ul
                className="nav nav-tabs card-header-tabs"
                data-bs-toggle="tabs"
              >
                {tab?.map((item, index) => {
                  if (item.hidden) return null;
                  return (
                    <li className="nav-item" key={index}>
                      <a
                        href={`#${item.status}`}
                        onClick={() =>
                          tabHandleClick(item.status ?? '', item.type)
                        }
                        className={`nav-link text-${item.label} ${
                          tabStatus === item.status ? 'active' : ''
                        }`}
                        data-bs-toggle="tab"
                      >
                        <b>{item.label}</b>
                        <span
                          className={`badge bg-${item.label} badge-light ml-5`}
                        >
                          {item.getTotal(total) ?? '0'}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              title
            )}
          </div>
          <div className="overflow-y-auto d-flex flex-grow-1">
            <div className="d-flex flex-column" style={{ flex: 1 }}>
              <div className={'d-flex mb-3 px-2 pt-3'}>
                <div
                  className={clsx('btn-list w-100', {
                    'justify-content-end': !renderExtraFilter,
                  })}
                >
                  {renderExtraFilter &&
                    renderExtraFilter({ tabStatus, total, totalDocs })}
                  {isEnableTypeFilter && (
                    <label
                      className="d-flex align-items-center mx-1 cursor-pointer"
                      style={{
                        minWidth: '200px',
                        maxWidth: '400px',
                        overflow: 'hidden',
                      }}
                    >
                      <b className="mx-2">Type:</b>
                      <Select
                        value={type}
                        onChange={handleTypeChange}
                        options={typeOptions}
                        menuPortalTarget={document.body}
                        styles={selectCustomStyles}
                      />
                    </label>
                  )}
                  {branchFilter && (
                    <label
                      className="d-flex align-items-center mx-1 cursor-pointer"
                      style={{
                        minWidth: '200px',
                        maxWidth: '400px',
                        overflow: 'hidden',
                      }}
                    >
                      <b className="mx-2">Branch:</b>
                      <Select
                        value={selectedBranch}
                        onChange={branchSelectedHandleChange}
                        options={branch}
                        menuPortalTarget={document.body}
                        styles={selectCustomStyles}
                      />
                    </label>
                  )}
                  <div className="input-icon mx-2">
                    <span className="input-icon-addon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx={10} cy={10} r={7} />
                        <line x1={21} y1={21} x2={15} y2={15} />
                      </svg>
                    </span>
                    <input
                      ref={searchRef}
                      type="text"
                      className="form-control"
                      placeholder="Search…"
                      onChange={(e) => {
                        debounceSearch(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                ref={tableRef}
                className="card-table table-responsive border-top"
                style={{ flex: 1 }}
              >
                <table className="table  table-vcenter table-hover">
                  <thead className="position-sticky top-0 ">
                    <tr>{renderTableHead(arrCustomer, tabStatus)}</tr>
                  </thead>
                  <tbody>
                    {!loading && arrCustomer?.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center">
                          No result found
                        </td>
                      </tr>
                    ) : null}
                    {loading ? (
                      <tr>
                        <td colSpan={11} style={{ background: '#f8fafc' }}>
                          <div className="d-flex justify-content-center">
                            <span
                              className="spinner-border spinner-border-sm d-block mx-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span className="sr-only">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      arrCustomer?.map((item, index) => {
                        return (
                          <tr
                            style={{
                              background: item.deleted
                                ? 'rgb(247 219 219 / 45%)'
                                : '',
                            }}
                            key={index}
                            onClick={() => {
                              disableRowClick ? null : onRowClick(item);
                            }}
                            role="button"
                          >
                            {renderTableBody({
                              index,
                              item,
                              handleShowTransactionDetail,
                              tabStatus,
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="py-2 border-top border-bottom d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center mx-2">
                  <label className="mx-2">Row per page :</label>
                  <select
                    value={rowPerPage}
                    onChange={handleChangeRowPerPage}
                    className="form-select w-auto"
                    aria-label="multiple select example"
                  >
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div className="mx-4">
                  {!!totalDocs && totalDocs > 0 && (
                    <span className="text-muted">
                      {(Number(pageNum) - 1) * rowPerPage + 1} -{' '}
                      {Number(pageNum) * rowPerPage > totalDocs
                        ? totalDocs
                        : Number(pageNum) * rowPerPage}{' '}
                      of {totalDocs}
                    </span>
                  )}
                </div>
                <div className="mx-2">
                  {!!totalDocs && totalDocs > 0 && (
                    <ReactPaginate
                      forcePage={pageNum - 1 ? pageNum - 1 : 0}
                      previousLabel={
                        <div className="mx-1">
                          <svg
                            className="icon"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <polyline points="15 6 9 12 15 18" />
                          </svg>
                        </div>
                      }
                      nextLabel={
                        <div className="mx-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <polyline points="9 6 15 12 9 18" />
                          </svg>
                        </div>
                      }
                      pageCount={Math.ceil(totalDocs / rowPerPage)}
                      marginPagesDisplayed={3}
                      pageRangeDisplayed={3}
                      onPageChange={handleChangePageNum}
                      containerClassName={'pagination m-0 ml-auto'}
                      pageClassName={'page-item'}
                      pageLinkClassName={'page-link'}
                      previousClassName={'page-item'}
                      previousLinkClassName={'page-link'}
                      nextClassName={'page-item'}
                      nextLinkClassName={'page-link'}
                      breakClassName={'page-item'}
                      breakLinkClassName={'page-link'}
                      activeClassName={'active'}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <LogsModal
          onClose={closeTransactionLogModal}
          open={transactionLogModalOpen}
          openSpinner={openSpinner}
          closeSpinner={closeSpinner}
          ref={transactionLogModalRef}
          transactionNo={arrDetails?.transactionNumber}
        />
        <DetailModal
          data={arrDetails}
          onShowLogs={() => openTransactionLogModal()}
          ref={modalRef}
        />
        <Spinner {...spinnerState} />
      </div>
    </>
  );
};
const TransactionTable = forwardRef(TransactionTableInner) as <
  T extends TransactionLike
>(
  props: TransactionTableProps<T> & {
    ref?: ForwardedRef<TransactionTabListHandle>;
  }
) => ReturnType<typeof TransactionTableInner>;
export default TransactionTable;
