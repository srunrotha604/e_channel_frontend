import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import { toast } from 'react-toastify';
import type { SelectOption } from '../../../../@type/report';
import Modal, { useModal } from '../../../../components/common/modal';
import Loading from '../../../../components/Loading';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { BranchItem } from '../../entities';
import {
  assignBranchAdmin,
  fetchBranchList,
  useListPagination,
} from '../../interface-adapters';
import { buildBranchAdminAssignDto } from '../../use-cases';
const BranchPage = () => {
  document.title = 'E-CHANNEL PORTAL | Branch';
  const navigate = useNavigate();
  const [arrList, setArrList] = useState<BranchItem[]>([]);
  const [listUser, setListUser] = useState<SelectOption[]>([]);
  const [selectedAdminValue, setSelectedAdminValue] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [query, setQuery] = useState('');
  const { modalRef, openModal, closeModal } = useModal();
  const { loading, refresh: refreshList } = useRequest(fetchBranchList, {
    onSuccess: (res) => {
      setArrList(res?.data?.list ?? []);
      setListUser(res?.data?.user ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });
  const createNewHandleClick = () => {
    navigate(ROUTE_PATH.branchCreate);
  };
  const { run: runAssignBranchAdmin, loading: assignLoading } = useRequest(
    assignBranchAdmin,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        closeModal();
        refreshList();
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    runAssignBranchAdmin(
      buildBranchAdminAssignDto(selectedBranch, selectedAdminValue)
    );
    e.preventDefault();
  };
  const userHandleChange = (value: MultiValue<SelectOption> | null) => {
    setSelectedAdminValue(
      Array.isArray(value) ? value.map((x) => x.value) : []
    );
  };
  const filteredList = arrList.filter((item) => {
    const search = query.toLowerCase().trim();
    return search === ''
      ? true
      : item.intermediaryCode?.toLowerCase()?.includes(search) ||
          item.intermediaryName?.toLowerCase()?.includes(search) ||
          item.admin?.toLowerCase()?.includes(search);
  });
  const { pageCount, pagedItems, handlePageClick, nf, setCurrentPage } =
    useListPagination(filteredList);
  return (
    <React.Fragment>
      <Modal ref={modalRef} title={'Admin User'} size="xl">
        <div className="mb-3">
          <label className="form-label required">User</label>
          <div>
            <Select
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              placeholder="Select Option"
              value={listUser?.filter((obj) =>
                selectedAdminValue.includes(obj.value)
              )}
              onChange={userHandleChange}
              options={listUser}
              isMulti
              isClearable
              closeMenuOnSelect={false}
            />
            <div className="invalid-feedback">Please select User!</div>
          </div>
        </div>
        <div className="form-footer">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={funcButtonHandleClickExecute}
            disabled={assignLoading}
          >
            {assignLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </Modal>
      {loading && <Loading value={loading} />}
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Branch</h2>
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
                          Create branch
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
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setCurrentPage(0);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row row-cards">
              <div className="col-12">
                <div className="card">
                  <table className="table table-vcenter card-table table-hover">
                    <thead className="transaction-table-head">
                      <tr>
                        <th className="tb-w-10">#</th>
                        <th>CODE</th>
                        <th>BRANCH NAME</th>
                        <th>ADMIN</th>
                        <th>PROJECT</th>
                        <th className="tb-w-10">STATUS</th>
                        <th className="tb-w-100">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-muted transaction-table-cell-muted">
                            {item.intermediaryCode}
                          </td>
                          <td className="text-muted transaction-table-cell-muted">
                            {item.intermediaryName}
                          </td>
                          <td
                            className="text-underline text-primary text-pre-line"
                            onClick={() => {
                              openModal();
                              setSelectedBranch(item.transactionCode ?? '');
                              setSelectedAdminValue(item.adminValue ?? []);
                            }}
                          >
                            {item.admin === '' ? 'N/A' : item.admin}
                          </td>
                          <td className="text-underline">
                            <Link
                              to={ROUTE_PATH.branchProject(
                                item.transactionCode ?? ''
                              )}
                            >
                              project
                            </Link>
                          </td>
                          {item.status === 'Active' ? (
                            <td className="text-primary">{item.status}</td>
                          ) : (
                            <td className="text-danger">{item.status}</td>
                          )}
                          <td>
                            <Link
                              to={ROUTE_PATH.projectEdit(
                                item.transactionCode ?? ''
                              )}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-edit"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#00b341"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                <line x1={16} y1={5} x2={19} y2={8} />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <p className="m-0 text-muted transaction-table-cell-muted">
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
    </React.Fragment>
  );
};
export default BranchPage;
