import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../../../components/Loading';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { UserRoleItem } from '../../entities';
import { deleteUserRole, fetchUserRoleList } from '../../interface-adapters';
const UserRolePage = () => {
  document.title = 'E-CHANNEL PORTAL | user';
  const navigate = useNavigate();
  const params = useParams<{ key: string }>();
  const [arrList, setArrList] = useState<UserRoleItem[]>([]);
  const [getKey, setGetKey] = useState('');
  const [getStatus, setStatus] = useState('');
  const [getApplicationName, setApplicationName] = useState('');
  const [getRoleName, setRoleName] = useState('');
  const { loading, refresh: refreshList } = useRequest(
    () => fetchUserRoleList(params.key || ''),
    {
      onSuccess: (res) => {
        setArrList(res?.data?.item ?? []);
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const { run: runDeleteUserRole, loading: deleteLoading } = useRequest(
    deleteUserRole,
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
    runDeleteUserRole({ key: getKey });
  };

  const handleDeleteClick = (item: UserRoleItem) => {
    setGetKey(item.key ?? '');
    item.status === 'Active'
      ? setStatus('delete this Role?')
      : setStatus('#active this Role?');
  };

  const handleViewClick = (item: UserRoleItem) => {
    setStatus(item.status ?? '');
    setApplicationName(item.applicationFamilyLabel ?? '');
    setRoleName(item.roleFamilyLabel ?? '');
  };

  const createNewHandleClick = () => {
    navigate(ROUTE_PATH.userRoleCreate(params.key ?? ''));
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.user);
  };

  return (
    <React.Fragment>
      {loading && <Loading value={loading} />}
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">User role</h2>
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

                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    onClick={createNewHandleClick}
                    data-bs-toggle="modal"
                    data-bs-target="#modal-main-menu"
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
                    Add role
                  </button>
                  <button
                    className="btn btn-primary d-sm-none btn-icon"
                    onClick={createNewHandleClick}
                    data-bs-toggle="modal"
                    data-bs-target="#modal-main-menu"
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
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <p className="form-label">Menu list</p>
                </div>
                <table className="table card-table table-vcenter text-nowrap table-hover card-table mt-2">
                  <thead>
                    <tr>
                      <th style={{ width: '5%' }}>#</th>
                      <th>APPLICATION NAME</th>
                      <th>ROLE NAME</th>
                      <th style={{ width: '10%' }}>STATUS</th>
                      <th style={{ width: '10%' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrList &&
                      arrList.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-underline">
                            <Link
                              to={
                                '/user/role/access/company/' +
                                item.applicationFamily +
                                '/' +
                                item.userCode
                              }
                            >
                              {item.applicationFamilyLabel}
                            </Link>
                          </td>
                          <td className="text-muted">{item.roleFamilyLabel}</td>
                          {item.status === 'Active' ? (
                            <td className="text-primary">{item.status}</td>
                          ) : (
                            <td className="text-danger">{item.status}</td>
                          )}
                          <td>
                            <a
                              className="cursor-pointer"
                              data-bs-toggle="offcanvas"
                              aria-controls="offcanvasView"
                              href="#offcanvasView"
                              onClick={() => handleViewClick(item)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-eye"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#00abfb"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <circle cx={12} cy={12} r={2} />
                                <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
                              </svg>
                            </a>
                            <span
                              data-bs-toggle="modal"
                              data-bs-target="#modal-remove-category"
                              className="cursor-pointer text-red text-underline"
                              onClick={() => handleDeleteClick(item)}
                            >
                              {item.status === 'Active' ? (
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
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-checkbox"
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#6f32be"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <polyline points="9 11 12 14 20 6" />
                                  <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
                                </svg>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="offcanvasView"
      >
        <div className="offcanvas-header">
          <h2 className="offcanvas-title" id="offcanvasStartLabel">
            View details
          </h2>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <div className="text-left">
            <table className="table">
              <tbody>
                <tr>
                  <td>- Application name :</td>
                  <td className="text-muted">{getApplicationName}</td>
                </tr>
                <tr>
                  <td>- Role name :</td>
                  <td className="text-muted">{getRoleName}</td>
                </tr>
                <tr>
                  <td>- Status :</td>
                  <td className="text-muted">{getStatus}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        className="modal modal-blur fade"
        id="modal-remove-category"
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
                <div className="text-muted">
                  Do you really want to {getStatus}
                </div>
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

export default UserRolePage;
