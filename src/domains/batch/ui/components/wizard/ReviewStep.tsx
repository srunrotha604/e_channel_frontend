import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ActionSaveDraftConfirmationModal from '../../../../../components/common/ActionSaveDraftConfirmationModal';
import { useModal } from '../../../../../components/common/modal';
import Spinner, { useSpinner } from '../../../../../components/common/Spinner';
import { useAuth } from '../../../../../context/AuthContext';
import useMessage from '../../../../../hooks/useMessage';
import { formatDay } from '../../../../../utils/format-day';
import { ROUTE_PATH } from '../../../../../utils/route-util';
import type {
  BatchCustomerListResult,
  BatchCustomerRow,
} from '../../../entities';
import { submitBatchCustomerList } from '../../../interface-adapters';
import type { DuplicateColorMap } from '../../../use-cases';
import {
  buildBatchSubmitDto,
  generateDuplicateColorMap,
} from '../../../use-cases';
const TAB = {
  New: 'New',
  Duplicate: 'Duplicate',
  Invalid: 'Invalid',
  Existing: 'Existing',
};
interface ReviewStepProps {
  customerList: BatchCustomerListResult;
  handleReviewBackStep: () => void;
  product: string;
}
const ReviewStep = (props: ReviewStepProps) => {
  const { customerList, handleReviewBackStep, product } = props;
  const { getValues } = useFormContext();
  const { hasPermissionProccessTransaction } = useAuth();
  const reviewDetails = getValues();
  const navigate = useNavigate();
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const { showErrorResponseMessage } = useMessage();
  const handleSubmit = async ({ isDraft }: { isDraft: boolean }) => {
    try {
      openSpinner();
      const data = buildBatchSubmitDto(customerList?.list, reviewDetails, {
        productCode: product,
        isDraft,
      });
      await submitBatchCustomerList(data);
      if (isDraft) {
        toast.success('Draft saved successfully');
      } else {
        toast.success('Batch Customer saved successfully');
      }
      navigate(ROUTE_PATH.dashboard);
      closeModal();
    } catch (error) {
      showErrorResponseMessage(error);
    } finally {
      closeSpinner();
    }
  };
  const [arrList, setArrList] = useState<BatchCustomerRow[]>(
    customerList.list ?? []
  );
  const [tabStatus, setTabStatus] = useState(TAB.New);
  const navTab = [
    { label: TAB.New, status: TAB.New, total: customerList.totalRecord },
    {
      label: TAB.Existing,
      status: TAB.Existing,
      total: customerList.totalExistingRecord,
    },
    {
      label: TAB.Duplicate,
      status: TAB.Duplicate,
      total: customerList.totalDuplicateRecord,
    },
    {
      label: TAB.Invalid,
      status: TAB.Invalid,
      total: customerList.totalErrorRecord,
    },
  ];
  const tabHandleClick = (value: string) => {
    setTabStatus(value);
    setCurrentPage(0);
    switch (value) {
      case TAB.New:
        setArrList(customerList.list ?? []);
        break;
      case TAB.Existing:
        setArrList(customerList.existingList ?? []);
        break;
      case TAB.Duplicate:
        setArrList(customerList.duplicateList ?? []);
        break;
      case TAB.Invalid:
        setArrList(customerList.errorList ?? []);
        break;
    }
  };
  const PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);

  function handlePageClick({ selected: selectedPage }: { selected: number }) {
    setCurrentPage(selectedPage);
  }
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(arrList.length / PER_PAGE);
  const { modalRef, openModal, closeModal } = useModal();
  const customerDataList = arrList?.slice(offset, offset + PER_PAGE);
  let duplicated: DuplicateColorMap = {
    nic: new Map(),
    customerId: new Map(),
    nicColor: 1,
    customerIdColor: 0,
  };
  if (tabStatus === TAB.Duplicate) {
    duplicated = generateDuplicateColorMap(arrList);
  }
  return (
    <div className="page-wrapper">
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-md-12 col-lg-12">
              <div className="card p-3">
                <div className="row row-cards">
                  <div className="col-12">
                    <h2 className="card-transaction-title text-center mb-3">
                      <span>REVIEW</span>
                    </h2>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Project</label>
                        </div>
                        <input
                          className="form-control"
                          value={reviewDetails?.project?.label}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Policy</label>
                        </div>
                        <input
                          className="form-control"
                          value={reviewDetails?.policy?.value}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <ul
                          className="nav nav-tabs card-header-tabs"
                          data-bs-toggle="tabs"
                        >
                          {navTab.map((item, index) => {
                            return (
                              <li className="nav-item" key={index}>
                                <a
                                  href={`#${item.status}`}
                                  onClick={() => tabHandleClick(item.status)}
                                  className={`nav-link ${
                                    tabStatus === item.status ? 'active' : ''
                                  }`}
                                  data-bs-toggle="tab"
                                >
                                  {item.label}
                                  <span className="badge badge-light ml-5">
                                    {item.total}
                                  </span>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="card-body">
                        <div className="tab-content">
                          <div className="tab-pane active show">
                            <div>
                              <div className="row align-items-right mb-2">
                                <div className="col-auto ms-auto d-print-none">
                                  <div className="btn-list"></div>
                                </div>
                              </div>
                              <div className="col-12 overflow-auto ">
                                <table className=" table table-vcenter card-table">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>SURNAME</th>
                                      <th>FIRST NAME</th>
                                      <th>GENDER</th>
                                      <th>TEL NO.</th>
                                      <th>DATE OF BIRTH</th>
                                      <th>NIC/PASSPORT</th>
                                      <th>Parent ID</th>
                                      <th>Children ID</th>
                                      <th>NATION</th>
                                      <th>PHYSICAL CARD</th>
                                      <th>OPENING DATE</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {customerDataList.map((item, index) => (
                                      <tr key={index}>
                                        <td>{item.rowNumber}</td>
                                        <td className="text-muted">
                                          {item.surName}
                                        </td>
                                        <td className="text-muted">
                                          {item.firstName}
                                        </td>
                                        <td className="text-muted">
                                          {item.gender}
                                        </td>
                                        <td className="text-muted">
                                          {item.telNo}
                                        </td>
                                        <td className="text-muted">
                                          {item.dateOfBirth
                                            ? formatDay(
                                                item.dateOfBirth,
                                                'DD/MM/YYYY'
                                              )
                                            : 'N/A'}
                                        </td>
                                        <td
                                          className="text-dark"
                                          style={{
                                            background:
                                              duplicated?.nic?.get(
                                                item.nicPassport
                                              ) || 'white',
                                          }}
                                        >
                                          {item.nicPassport}
                                        </td>
                                        <td className="text-muted">
                                          {item.parentId || 'N/A'}
                                        </td>
                                        <td
                                          className="text-dark"
                                          style={{
                                            background:
                                              duplicated?.customerId?.get(
                                                item.customerId
                                              ) || 'white',
                                          }}
                                        >
                                          {item.customerId}
                                        </td>
                                        <td className="text-muted">
                                          {item.nation}
                                        </td>
                                        <td className="text-muted">
                                          {item.physicalCard}
                                        </td>
                                        <td className="text-muted">
                                          {item.openingDate
                                            ? formatDay(
                                                item.openingDate,
                                                'DD/MM/YYYY'
                                              )
                                            : 'N/A'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div className="d-flex align-items-center mt-2">
                                  <div className="m-0 text-muted">
                                    Total <span>{arrList.length}</span> entries
                                  </div>
                                  <ReactPaginate
                                    forcePage={currentPage}
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
                                          <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                          />
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
                                          <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                          />
                                          <polyline points="9 6 15 12 9 18" />
                                        </svg>
                                      </div>
                                    }
                                    pageCount={pageCount || 1}
                                    marginPagesDisplayed={3}
                                    pageRangeDisplayed={3}
                                    onPageChange={handlePageClick}
                                    containerClassName={
                                      'pagination m-0 ms-auto'
                                    }
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
                              <div className="form-footer">
                                <div className="btn-list">
                                  <button
                                    onClick={handleReviewBackStep}
                                    className="btn btn-secondary"
                                    type="button"
                                  >
                                    Back
                                  </button>
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    disabled={
                                      (customerList?.totalRecord ?? 0) <= 0
                                    }
                                    onClick={openModal}
                                  >
                                    Submit
                                  </button>
                                  <Spinner {...spinnerState} />
                                  <ActionSaveDraftConfirmationModal
                                    modalRef={modalRef}
                                    closeModal={closeModal}
                                    confirm={hasPermissionProccessTransaction(
                                      'submitted'
                                    )}
                                    saveDraft={hasPermissionProccessTransaction(
                                      'draft'
                                    )}
                                    onSaveDraft={() => {
                                      handleSubmit({ isDraft: true });
                                    }}
                                    onConfirm={() =>
                                      handleSubmit({ isDraft: false })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewStep;
