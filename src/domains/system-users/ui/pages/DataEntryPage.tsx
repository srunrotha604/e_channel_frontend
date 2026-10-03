import { useRequest } from 'ahooks';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableCellAction from '../../../../components/form/TableCellAction';
import TableCellDelete from '../../../../components/form/TableCellDelete';
import TableCellStatus from '../../../../components/form/TableCellStatus';
import Loading from '../../../../components/Loading';
import { useAuth } from '../../../../context/AuthContext';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { DataEntryItem } from '../../entities';
import {
  addDataEntryPhoneNumber,
  deleteDataEntry,
  fetchDataEntryList,
  toggleDataEntryStatus,
} from '../../interface-adapters';
import AddPhoneNumberModal from '../components/AddPhoneNumberModal';

const DataEntryPage = () => {
  document.title = 'E-CHANNEL PORTAL | Data Entry';
  const navigate = useNavigate();
  const { selectedBranch } = useAuth() as {
    selectedBranch: { value?: string } | null;
  };
  const [query, setQuery] = useState('');
  const [arrList, setArrList] = useState<DataEntryItem[]>([]);

  const { loading, refresh: refreshList } = useRequest(
    () => fetchDataEntryList(selectedBranch?.value),
    {
      onSuccess: (res) => {
        setArrList(res?.data?.list ?? []);
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );

  const { run: runToggleDataEntryStatus } = useRequest(toggleDataEntryStatus, {
    manual: true,
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      refreshList();
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });

  const { run: runDeleteDataEntry } = useRequest(deleteDataEntry, {
    manual: true,
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      refreshList();
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });

  const statusHandleClickExecute = (key?: string) => {
    runToggleDataEntryStatus({ key });
  };

  const funcRemoveHandleClickExecute = (key?: string) => {
    runDeleteDataEntry({ key });
  };

  const createNewHandleClick = () => {
    navigate(ROUTE_PATH.dataEntryCreate);
  };
  const importHandleClick = () => {
    navigate(ROUTE_PATH.dataEntryImport);
  };
  const PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);

  function handlePageClick({ selected: selectedPage }: { selected: number }) {
    setCurrentPage(selectedPage);
  }

  const filteredList = arrList?.filter((item) => {
    const search = query.toLowerCase().trim();

    return search === ''
      ? true
      : item.userName?.toLowerCase()?.includes(search) ||
          item.email?.toLowerCase()?.includes(search) ||
          item.givenName?.toLowerCase()?.includes(search) ||
          item.sureName?.toLowerCase()?.includes(search) ||
          item.phone?.toLowerCase()?.includes(search);
  });

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil((filteredList?.length ?? 0) / PER_PAGE);
  return (
    <>
      {loading && <Loading value={loading} />}
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Data Entry</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <div>
                    <button
                      className="btn btn-primary d-none d-sm-inline-block"
                      onClick={() => refreshList()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-refresh"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                      </svg>
                      Reload
                    </button>
                    <button
                      className="btn btn-primary d-sm-none btn-icon"
                      onClick={() => refreshList()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-refresh"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                      </svg>
                    </button>
                  </div>
                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    onClick={importHandleClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-upload"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                      <polyline points="7 9 12 4 17 9" />
                      <line x1={12} y1={4} x2={12} y2={16} />
                    </svg>
                    Import data entry
                  </button>
                  <button
                    className="btn btn-primary d-sm-none btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-input-field"
                    aria-label="Create new category"
                    onClick={importHandleClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-upload"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                      <polyline points="7 9 12 4 17 9" />
                      <line x1={12} y1={4} x2={12} y2={16} />
                    </svg>
                  </button>
                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    onClick={createNewHandleClick}
                  >
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
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                    Create data entry
                  </button>
                  <button
                    className="btn btn-primary d-sm-none btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-input-field"
                    aria-label="Create new category"
                    onClick={createNewHandleClick}
                  >
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
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="row align-items-center mb-2">
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <div className="input-icon">
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
                      type="text"
                      className="form-control"
                      placeholder="Search…"
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row row-cards">
              <div className="col-12">
                <div className="card">
                  <table className="table table-vcenter card-table">
                    <thead>
                      <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th>USER NAME</th>
                        <th>EMAIL</th>
                        <th>PHONE</th>
                        <th>FIRST NAME</th>
                        <th>LAST NAME</th>
                        <th>ROLE</th>
                        <th>TYPE</th>
                        <th style={{ width: '15%' }}>STATUS</th>
                        <th style={{ width: '40%' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList
                        ?.slice(offset, offset + PER_PAGE)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-muted">{item.userName}</td>
                            <td className="text-muted">{item.email}</td>
                            <td className="cursor-pointer">
                              <AddPhoneNumberModal
                                item={item}
                                success={() => refreshList()}
                                onSubmit={addDataEntryPhoneNumber}
                              />
                            </td>
                            <td className="text-muted">{item.givenName}</td>
                            <td className="text-muted">{item.sureName}</td>
                            <td className="text-muted">{item.roleName}</td>
                            <td className="text-muted">{item.userType}</td>
                            <TableCellStatus
                              status={item?.status}
                              statusOnClick={() =>
                                statusHandleClickExecute(item?.transactionCode)
                              }
                            />
                            <TableCellAction>
                              {item?.deleted ? (
                                <TableCellDelete
                                  deleteOnClick={() =>
                                    funcRemoveHandleClickExecute(
                                      item?.transactionCode
                                    )
                                  }
                                />
                              ) : (
                                ''
                              )}
                            </TableCellAction>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex align-items-center mt-2">
                  <p className="m-0 text-muted">
                    Total <span>{filteredList.length}</span> entries
                  </p>
                  <ReactPaginate
                    previousLabel={
                      <div>
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
                        prev
                      </div>
                    }
                    nextLabel={
                      <div>
                        next
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
                    pageCount={pageCount}
                    marginPagesDisplayed={3}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination m-0 ms-auto'}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataEntryPage;
