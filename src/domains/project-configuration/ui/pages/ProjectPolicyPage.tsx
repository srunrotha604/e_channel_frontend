import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../../../components/Loading';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { ProjectPolicyItem } from '../../entities';
import {
  deleteProjectPolicy,
  fetchProjectPolicyList,
  useListPagination,
} from '../../interface-adapters';
const ProjectPolicyPage = () => {
  document.title = 'E-CHANNEL PORTAL | project';
  const navigate = useNavigate();
  const params = useParams<{ key: string }>();
  const [arrList, setArrList] = useState<ProjectPolicyItem[]>([]);
  const [query, setQuery] = useState('');
  const [transactionCode, setTransationCode] = useState('');
  const { loading, refresh: refreshList } = useRequest(
    () => fetchProjectPolicyList(params.key ?? ''),
    {
      onSuccess: (res) => {
        setArrList(res?.data?.list ?? []);
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const { run: runDeleteProjectPolicy, loading: deleteLoading } = useRequest(
    deleteProjectPolicy,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        refreshList();
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const funcRemoveHandleClickExecute = () => {
    runDeleteProjectPolicy({ transationCode: transactionCode });
  };
  const getRecordHandleClick = (option: string, item: ProjectPolicyItem) => {
    switch (option) {
      case 'delete':
        setTransationCode(item.transationCode ?? '');
        break;
      default:
        navigate(ROUTE_PATH.error404);
    }
  };
  const createNewHandleClick = () => {
    navigate(ROUTE_PATH.projectPolicyCreate(params.key ?? ''));
  };
  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.project);
  };
  const search = query.toLowerCase();
  const filteredList = arrList.filter((item) =>
    search === '' ? true : item.projectLabel?.toLowerCase().includes(search)
  );
  const { pageCount, pagedItems, handlePageClick, nf } =
    useListPagination(filteredList);
  return (
    <React.Fragment>
      {loading && <Loading value={loading} />}
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Project policy</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="row align-items-center">
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
                      <>
                        <button
                          className="btn btn-primary d-none d-sm-inline-block"
                          onClick={goBackHandleClick}
                        >
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
                            <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
                          </svg>
                          Back
                        </button>
                        <button
                          className="btn btn-primary d-sm-none btn-icon"
                          onClick={goBackHandleClick}
                        >
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
                            <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
                          </svg>
                        </button>
                      </>
                      <>
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
                          Add policy
                        </button>
                        <button
                          className="btn btn-primary d-sm-none btn-icon"
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
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="container-xl">
            <div className="row align-items-center mb-2">
              <div className="col-auto ms-auto d-print-none">
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
                    style={{ cursor: 'pointer' }}
                    type="text"
                    className="form-control"
                    placeholder="Search…"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row row-cards">
              <div className="col-12">
                <div className="card">
                  <table className="table table-vcenter card-table table-hover">
                    <thead>
                      <tr>
                        <th className="tb-w-10">#</th>
                        <th>PROJECT NAME</th>
                        <th>POLICY</th>
                        <th>INSURED NAME</th>
                        <th className="tb-w-10">STATUS</th>
                        <th className="tb-w-100">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>

                          <td className="text-muted">{item.projectLabel}</td>
                          <td className="text-muted">{item.policyCode}</td>
                          <td className="text-muted">{item.insuredName}</td>
                          {item.status === 'Active' ? (
                            <td className="text-primary">{item.status}</td>
                          ) : (
                            <td className="text-danger">{item.status}</td>
                          )}
                          <td>
                            <span
                              data-bs-toggle="modal"
                              data-bs-target="#modal-remove"
                              className="cursor-pointer text-red text-underline"
                              onClick={() =>
                                getRecordHandleClick('delete', item)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-trash"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#ff2825"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <line x1={4} y1={7} x2={20} y2={7} />
                                <line x1={10} y1={11} x2={10} y2={17} />
                                <line x1={14} y1={11} x2={14} y2={17} />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                              </svg>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <p className="m-0 text-muted">
                    Total <span>{nf.format(filteredList.length)}</span> entries
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
      <div
        className="modal modal-blur fade"
        id="modal-remove"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-sm modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
            <div className="modal-status bg-danger" />
            <div className="modal-body py-4">
              <div className="text-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon mb-2 text-danger icon-lg"
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
                  <path d="M12 9v2m0 4v.01" />
                  <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                </svg>
                <h3>Are you sure?</h3>
                <div className="text-muted">Do you really want to remove?</div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="w-100">
                <div className="row">
                  <div className="col">
                    <button className="btn w-100" data-bs-dismiss="modal">
                      Cancel
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-danger w-100"
                      data-bs-dismiss="modal"
                      onClick={funcRemoveHandleClickExecute}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                      ) : (
                        'Confirm'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProjectPolicyPage;
