import { useRequest } from 'ahooks';
import clsx from 'clsx';
import fileDownload from 'js-file-download';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import ReactSelect from 'react-select';
import type { SelectOption } from '../../../../@type/report';
import Button from '../../../../components/common/Button';
import { selectCustomStyles } from '../../../../components/common/reactSelectStyles';
import DateRangeSelector from '../../../../components/form/DateRangeSelector';
import ProjectSelect from '../../../../components/form/ProjectSelect';
import { useAuth } from '../../../../context/AuthContext';
import useMessage from '../../../../hooks/useMessage';
import { formatDay, getStartOfMonthDate } from '../../../../utils/format-day';
import { STATUS, typeOptions } from '../../../customer/entities';
import ComponentStatus from '../../../customer/ui/components/ComponentStatus';
import type { CustomerReportItem } from '../../entities';
import {
  exportCustomerReportList,
  fetchCustomerReportList,
} from '../../interface-adapters';
import {
  buildCustomerReportExportFilename,
  buildCustomerReportQueryParams,
  deriveBranchOptions,
  normalizeIssueDateRange,
  paginateCustomerReportList,
} from '../../use-cases';
const CustomerReportPage = () => {
  document.title = 'Report | customer report';
  const { hasPermissionAccessTransaction, company } = useAuth();
  const [data, setData] = useState<CustomerReportItem[] | null>(null);
  const [type, setType] = useState<SelectOption[]>([
    typeOptions[1],
    typeOptions[2],
  ]);
  const [status, setStatus] = useState<SelectOption[]>([]);
  const [rowPerPage, setRowPerPage] = useState(25);
  const [pageNum, setPageNum] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [branch, setBranch] = useState<SelectOption[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<SelectOption[]>([]);
  const [expirePolicy, setExpirePolicy] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SelectOption[]>([]);
  const [issueDateRange, setIssueDateRange] = useState<{
    startIssueDate: Date | null;
    endIssueDate: Date | null;
  }>({
    startIssueDate: getStartOfMonthDate().toDate(),
    endIssueDate: new Date(),
  });
  const [date, setDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: getStartOfMonthDate().toDate(),
    endDate: new Date(),
  });
  const onDateChange = ({
    startDate,
    endDate,
  }: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setDate({ startDate, endDate });
  };
  useEffect(() => {
    if (company) {
      setBranch(deriveBranchOptions(company));
    }
  }, [company]);
  useEffect(() => {
    const defaultSelectedStatus = [
      ...(hasPermissionAccessTransaction('confirmed')
        ? [{ label: STATUS.Confirmed, value: STATUS.Confirmed }]
        : []),
      ...(hasPermissionAccessTransaction('driRejected')
        ? [{ label: STATUS.DRI_Rejected, value: STATUS.DRI_Rejected }]
        : []),
    ];
    setStatus(defaultSelectedStatus);
  }, [hasPermissionAccessTransaction]);
  const statusOptions = useMemo(
    () => [
      {
        label: STATUS.Submitted,
        value: STATUS.Submitted,
        hidden: !hasPermissionAccessTransaction('submitted'),
      },
      {
        label: STATUS.Approved,
        value: STATUS.Approved,
        hidden: !hasPermissionAccessTransaction('approved'),
      },
      {
        label: STATUS.BM_Rejected,
        value: STATUS.BM_Rejected,
        hidden: !hasPermissionAccessTransaction('bmRejected'),
      },
      {
        label: STATUS.Confirmed,
        value: STATUS.Confirmed,
        hidden: !hasPermissionAccessTransaction('confirmed'),
      },
      {
        label: STATUS.DRI_Rejected,
        value: STATUS.DRI_Rejected,
        hidden: !hasPermissionAccessTransaction('driRejected'),
      },
    ],
    [hasPermissionAccessTransaction]
  );

  const { loading, run: getList } = useRequest(
    async ({
      pageNumber = 1,
      pageSize = 25,
    }: {
      pageNumber?: number;
      pageSize?: number;
    }) => {
      const response = await fetchCustomerReportList(
        buildCustomerReportQueryParams({
          type,
          status,
          date,
          issueDateRange,
          expirePolicy,
          selectedBranch,
          selectedProject,
        })
      );

      return paginateCustomerReportList(
        response?.data?.list ?? [],
        pageNumber,
        pageSize
      );
    },
    {
      manual: true,
      onSuccess: ({ items, total }) => {
        setTotalDocs(total);
        setData(items);
        setIsFieldDirty(false);
        resetTableScroll();
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpirePolicy(e.target.checked);
  };

  const onIssueDateChange = (
    payload: {
      startDate?: Date | null;
      endDate?: Date | null;
      startIssueDate?: Date | null;
      endIssueDate?: Date | null;
    } = {}
  ) => {
    setIssueDateRange(normalizeIssueDateRange(payload));
  };

  const { showErrorResponseMessage } = useMessage();

  const { loading: exportLoading, run: exportList } = useRequest(
    async () => {
      const response = await exportCustomerReportList(
        buildCustomerReportQueryParams({
          type,
          status,
          date,
          issueDateRange,
          expirePolicy,
          selectedBranch,
          selectedProject,
        })
      );
      if (!response?.data) return;
      fileDownload(
        response.data,
        buildCustomerReportExportFilename({ dateRange: date, issueDateRange })
      );
    },
    {
      manual: true,
      onError: (error) => {
        showErrorResponseMessage(error);
      },
    }
  );

  const tableRef = useRef<HTMLDivElement | null>(null);

  const resetTableScroll = (position = 0) => {
    if (tableRef.current) {
      tableRef.current.scrollTop = position;
    }
  };

  const isFilterAble =
    (date?.startDate && date?.endDate) ||
    (issueDateRange?.startIssueDate && issueDateRange?.endIssueDate);

  const [isFieldDirty, setIsFieldDirty] = useState(false);

  useEffect(() => {
    if ((date?.startDate || issueDateRange?.startIssueDate) && !isFieldDirty) {
      setIsFieldDirty(true);
    }
  }, [date, issueDateRange]);

  return (
    <div
      className="container-xl full-height-dashboard-container"
      style={{ height: '0', overflow: 'auto', display: 'flex' }}
    >
      <div className="page-body mb-0 flex-1 d-flex">
        <div className="card overflow-hidden d-flex flex-1">
          <div className="card-body pb-0" style={{ flex: 0 }}>
            <h2 className="mb-3">Customer Report</h2>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6 flex">
                    <div className="col-10">
                      <div>
                        <label className="form-label">
                          <b>Date:</b>
                        </label>
                        <DateRangeSelector
                          date={date}
                          placeholder={'Select Date'}
                          onDateChange={onDateChange}
                        />
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="flex justify-content-center">
                        <label className="form-label">
                          <b>Expire Policy</b>
                        </label>
                      </div>
                      <div className="flex justify-content-center mt-2">
                        <input
                          type="checkbox"
                          checked={expirePolicy}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div>
                      <label className="form-label">
                        <b>Date Of Issue Card:</b>
                      </label>
                      <DateRangeSelector
                        date={{
                          startDate: issueDateRange.startIssueDate,
                          endDate: issueDateRange.endIssueDate,
                        }}
                        placeholder="Select Issue Date"
                        onDateChange={onIssueDateChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div>
                      <label className="form-label">
                        <b>Type:</b>
                      </label>
                      <ReactSelect
                        isMulti
                        options={typeOptions.slice(1)}
                        value={type}
                        onChange={(value) => setType([...value])}
                        closeMenuOnSelect
                        styles={customSelectStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        <b>Status:</b>
                      </label>
                      <ReactSelect
                        value={status}
                        onChange={(value) => setStatus([...value])}
                        filterOption={(option) => !option.data.hidden}
                        closeMenuOnSelect={false}
                        isMulti
                        options={statusOptions}
                        styles={customSelectStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 ">
                    <div>
                      <label className="form-label">
                        <b>Branch:</b>
                      </label>
                      <ReactSelect
                        value={selectedBranch}
                        onChange={(value) => setSelectedBranch([...value])}
                        closeMenuOnSelect={false}
                        isMulti
                        options={branch}
                        styles={customSelectStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div>
                      <label className="form-label">
                        <b>Project:</b>
                      </label>
                      <ProjectSelect
                        value={selectedProject}
                        onChange={setSelectedProject}
                        isMulti
                        closeMenuOnSelect={false}
                        styles={customSelectStyle}
                        placeholder="Select project..."
                      />
                    </div>
                  </div>
                  <div className="btn-list mb-2 col-md-12 my-3 mb-3">
                    <Button
                      loading={loading}
                      style={{ width: '100px' }}
                      disabled={!isFilterAble}
                      onClick={() =>
                        getList({ pageNumber: 1, pageSize: rowPerPage })
                      }
                    >
                      Filter{' '}
                      {isFieldDirty && (
                        <span className="badge bg-white d-block ml-5" />
                      )}
                    </Button>
                    <div className="ms-auto" />
                    <Button
                      loading={exportLoading}
                      loadingText={'Exporting...'}
                      style={{ width: '100px' }}
                      onClick={exportList}
                      variant="primary"
                    >
                      Export
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-12"></div>
            </div>
          </div>
          <div
            ref={tableRef}
            className="table-responsive"
            style={{ flexGrow: 1 }}
          >
            <table className="table table-vcenter card-table">
              <thead className="position-sticky top-0 transaction-table-head">
                <tr>
                  <th>TRANSACTION</th>
                  <th>BATCH No.</th>
                  <th>INSURED NAME</th>
                  <th>PROJECT</th>
                  <th>PRODUCT</th>
                  <th>DATE</th>
                  <th>USER</th>
                  <th>BRANCH</th>
                  <th>Date Of Issue Card</th>
                  <th style={{ width: '10%' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {!loading && data?.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center">
                      No result found
                    </td>
                  </tr>
                ) : null}
                {data?.map((item, index) => (
                  <tr
                    style={{
                      background: item.deleted ? 'rgb(247 219 219 / 45%)' : '',
                    }}
                    key={index}
                  >
                    <td className="text-primary">{item.transactionNumber}</td>
                    <td
                      className={clsx({
                        'text-primary': item.batchNumber,
                      })}
                    >
                      {item?.batchNumber || 'N/A'}
                    </td>
                    <td className="text-muted transaction-table-cell-muted">
                      {item.sureName + ' ' + item.firstName}
                    </td>
                    <td className="text-muted transaction-table-cell-muted">
                      {item.projectCode}
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
                    <td className="text-muted transaction-table-cell-muted">
                      {item.customerIssueDate?.issueDate}
                    </td>
                    <td className={clsx('text-bold')}>
                      <ComponentStatus status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="py-2 border-top border-bottom d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center mx-2">
              <label className="mx-2">Row per page :</label>
              <select
                value={rowPerPage}
                onChange={(e) => {
                  setRowPerPage(Number(e.target.value));
                  getList({ pageNumber: 1, pageSize: Number(e.target.value) });
                }}
                className="form-select w-auto"
                aria-label="multiple select example"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="mx-4">
              {totalDocs > 0 && (
                <span className="text-muted transaction-table-cell-muted">
                  {(Number(pageNum) - 1) * rowPerPage + 1} -{' '}
                  {Number(pageNum) * rowPerPage > totalDocs
                    ? totalDocs
                    : Number(pageNum) * rowPerPage}{' '}
                  of {totalDocs}
                </span>
              )}
            </div>
            <div className="mx-2">
              {totalDocs > 0 && (
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
                  onPageChange={(e) => {
                    const tempPageNum = Number(e.selected) + 1;
                    setPageNum(tempPageNum);
                    getList({ pageNumber: tempPageNum, pageSize: rowPerPage });
                  }}
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
  );
};

const customSelectStyle = {
  ...selectCustomStyles,
};

export default CustomerReportPage;
