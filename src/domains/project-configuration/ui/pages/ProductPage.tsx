import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ActionConfirmationModal from '../../../../components/common/ActionConfirmationModal';
import { useModal } from '../../../../components/common/modal/index';
import Loading from '../../../../components/Loading';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { ProductItem } from '../../entities';
import {
  deleteProduct,
  fetchProductList,
  useListPagination,
} from '../../interface-adapters';
const ProductPage = () => {
  document.title = 'E-CHANNEL PORTAL | product';
  const navigate = useNavigate();
  const { modalRef, closeModal, openModal } = useModal();
  const [arrList, setArrList] = useState<ProductItem[]>([]);
  const [arrDetails, setArrDetails] = useState<ProductItem>({});
  const [query, setQuery] = useState('');
  const [transactionCode, setTransationCode] = useState('');
  const { loading, refresh: refreshList } = useRequest(fetchProductList, {
    onSuccess: (res) => {
      setArrList(res?.data?.list ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });
  const handleViewClick = (item: ProductItem) => {
    setArrDetails(item);
  };
  const { run: runDeleteProduct } = useRequest(deleteProduct, {
    manual: true,
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      refreshList();
      closeModal();
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });
  const deleteRecordHandleClick = () => {
    runDeleteProduct({ transactionCode });
  };
  const createNewHandleClick = () => {
    navigate(ROUTE_PATH.productCreate);
  };
  const search = query.toLowerCase();
  const filteredList = arrList.filter((item) =>
    search === '' ? true : item.productName?.toLowerCase().includes(search)
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
                <h2 className="page-title">Product</h2>
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
                          Create product
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
                        <th>PRODUCT CODE</th>
                        <th>PRODUCT LABEL</th>
                        <th>PRODUCT NAME</th>
                        <th className="tb-w-10">STATUS</th>
                        <th className="tb-w-100">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-muted">
                            {item.productsequenceCode}
                          </td>
                          <td className="text-muted">{item.productCode}</td>
                          <td className="text-muted">{item.productName}</td>
                          {item.status === 'Active' ? (
                            <td className="text-primary">{item.status}</td>
                          ) : (
                            <td className="text-danger">{item.status}</td>
                          )}
                          <td>
                            <a
                              className="cursor-pointer"
                              data-bs-toggle="offcanvas"
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
                            <Link
                              to={ROUTE_PATH.productEdit(
                                item.transationCode ?? ''
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
                            <a
                              className="cursor-pointer"
                              onClick={() => {
                                setTransationCode(item.transationCode ?? '');
                                openModal();
                              }}
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
                            </a>
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
            <table className="table table-hover">
              <tbody>
                <tr>
                  <td>Product code :</td>
                  <td className="text-muted">
                    {arrDetails.productsequenceCode}
                  </td>
                </tr>
                <tr>
                  <td>Product Label :</td>
                  <td className="text-muted">{arrDetails.productCode}</td>
                </tr>
                <tr>
                  <td>Product Name :</td>
                  <td className="text-muted">{arrDetails.productName}</td>
                </tr>
                <tr>
                  <td>Status :</td>
                  <td className="text-muted">{arrDetails.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ActionConfirmationModal
        closeModal={closeModal}
        modalRef={modalRef}
        isApprove
        confirmMessageText="Are you sure you want to delete product?"
        onApprove={deleteRecordHandleClick}
        onReject={() => {}}
      />
    </React.Fragment>
  );
};

export default ProductPage;
