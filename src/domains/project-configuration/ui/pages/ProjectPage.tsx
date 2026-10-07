import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { IoAddSharp, IoChevronBack } from 'react-icons/io5';
import { TfiReload } from 'react-icons/tfi';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../../components/Loading';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { ProjectItem } from '../../entities';
import { fetchProjectList, useListPagination } from '../../interface-adapters';
const ProjectPage = () => {
  document.title = 'E-CHANNEL PORTAL | project';
  const navigate = useNavigate();
  const [arrList, setArrList] = useState<ProjectItem[]>([]);
  const [query, setQuery] = useState('');
  const { loading, refresh: refreshList } = useRequest(fetchProjectList, {
    onSuccess: (res) => {
      setArrList(res?.data?.list ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });
  const createNewHandleClick = () => {
    navigate(ROUTE_PATH.projectCreate);
  };
  const search = query.toLowerCase();
  const filteredList = arrList.filter((item) =>
    search === '' ? true : item.projectName?.toLowerCase().includes(search)
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
                <h2 className="page-title">Project</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="row align-items-center">
                  <div className="col-auto ms-auto d-print-none">
                    <div className="btn-list">
                      <div>
                        <button
                          className="btn btn-primary d-none d-sm-inline-flex align-items-center gap-2"
                          onClick={() => refreshList()}
                        >
                          <TfiReload size={16} />
                          Reload
                        </button>
                        <button
                          className="btn btn-primary d-sm-none btn-icon"
                          onClick={() => refreshList()}
                        >
                          <TfiReload size={16} />
                        </button>
                      </div>
                      <>
                        <button
                          className="btn btn-primary d-none d-sm-inline-flex align-items-center gap-2"
                          onClick={createNewHandleClick}
                        >
                          <IoAddSharp size={20} />
                          Create project
                        </button>
                        <button
                          className="btn btn-primary d-sm-none btn-icon"
                          onClick={createNewHandleClick}
                        >
                          <IoAddSharp size={16} />
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
                    <thead className="transaction-table-head">
                      <tr>
                        <th className="tb-w-10">#</th>
                        <th>PROJECT NAME</th>
                        <th>POLICIES</th>
                        <th className="tb-w-10">STATUS</th>
                        <th className="tb-w-100">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>

                          <td className="text-muted transaction-table-cell-muted">
                            {item.projectName}
                          </td>
                          <td className="text-underline">
                            <Link
                              to={ROUTE_PATH.projectPolicy(
                                item.transationCode ?? 'sdfasdf'
                              )}
                            >
                              policies
                            </Link>
                          </td>
                          {item.status === 'Active' ? (
                            <td className="text-primary">{item.status}</td>
                          ) : (
                            <td className="text-danger">{item.status}</td>
                          )}
                          <td>
                            {/* <a
                              className="cursor-pointer me-2"
                              data-bs-toggle="offcanvas"
                              href="#offcanvasView"
                              onClick={() => handleViewClick(item)}
                            >
                              <LuEye size={16} color="#00abfb" />
                            </a> */}
                            <Link
                              to={ROUTE_PATH.projectEdit(
                                item.transationCode ?? ''
                              )}
                            >
                              <FaRegEdit size={16} color="#00b341" />
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
                        <IoChevronBack size={16} />
                        prev
                      </div>
                    }
                    nextLabel={
                      <div>
                        next
                        <IoIosArrowForward size={16} />
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
export default ProjectPage;
