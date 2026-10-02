import axios from 'axios';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ActionSaveDraftConfirmationModal from '../../../../../components/common/ActionSaveDraftConfirmationModal';
import { useModal } from '../../../../../components/common/modal';
import Spinner, { useSpinner } from '../../../../../components/common/Spinner';
import { useAuth } from '../../../../../context/AuthContext';
import { delay } from '../../../../../utils/delay';
import { handleApiError } from '../../../../../utils/handleApiError';
import { createCustomerTransaction } from '../../../interface-adapters';
import { buildCustomerCreateDto } from '../../../use-cases';
import TransactionDetail from '../transaction-table/CustomerTransactionDetail';
interface CustomerCreateReviewProps {
  handleBackStep?: () => void;
  handleSubmitted: (
    responseData: unknown,
    submitData: { status?: string }
  ) => void;
  productName?: string;
}
const CustomerCreateReview = (props: CustomerCreateReviewProps) => {
  const { user, selectedBranch, selectedCompany } = useAuth();
  const { handleBackStep, handleSubmitted, productName } = props;
  const { handleSubmit, getValues } = useFormContext();
  const { hasPermissionProccessTransaction } = useAuth();
  const formData = getValues();
  const params = useParams();
  const { openModal, closeModal, modalRef } = useModal();
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const onSubmit = async (
    data: Record<string, any>,
    { suppressSuccessToast = false } = {}
  ) => {
    try {
      openSpinner();
      const summaryData = buildCustomerCreateDto(data, {
        productCode: params.key,
      });
      const responseData = await createCustomerTransaction(summaryData);
      delay([
        closeSpinner,
        () => {
          if (!suppressSuccessToast) {
            const msg =
              data.status === 'Draft'
                ? 'Draft saved successfully'
                : 'Record created successfully';
            toast.success(msg);
          }
          handleSubmitted(responseData, summaryData);
          closeModal();
        },
      ]);
    } catch (error) {
      delay(() => {
        closeSpinner();
        const baseMsg =
          data.status === 'Draft'
            ? 'Failed to save draft'
            : 'Failed to create record';
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error(`${baseMsg}. The record already exists.`);
          return;
        }
        if (axios.isAxiosError(error)) {
          handleApiError(error, baseMsg);
        }
      });
    }
  };
  return (
    <div className="page-wrapper justify-content-center">
      <div className="page-body py-2">
        <div className="container-xl">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-transaction-title text-center mb-3">
                    <span>REVIEW</span>
                  </h2>
                  <form>
                    <ReviewDetail
                      data={{
                        ...formData,
                        productName,
                        inputter: `${
                          user?.email ||
                          `${user?.firstName || '' + user?.lastName || ''}` ||
                          ''
                        }`,
                        inputBranch: selectedBranch?.branchName,
                        inputCompany: selectedCompany?.companyName,
                      }}
                    />
                    <div className="form-footer">
                      <div className="btn-list">
                        <button
                          onClick={handleBackStep}
                          className="btn btn-secondary"
                          type="button"
                        >
                          Back
                        </button>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={openModal}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Spinner {...spinnerState} />
        <ActionSaveDraftConfirmationModal
          modalRef={modalRef}
          closeModal={closeModal}
          confirm={hasPermissionProccessTransaction('submitted')}
          saveDraft={hasPermissionProccessTransaction('draft')}
          onSaveDraft={handleSubmit((data) => {
            data.status = 'Draft';
            onSubmit(data, { suppressSuccessToast: true });
          })}
          onConfirm={handleSubmit((data) => onSubmit(data))}
        />
      </div>
    </div>
  );
};
interface ReviewDetailData {
  physicalCard?: boolean | string;
  firstName?: string;
  sureName?: string;
  telNo?: string;
  gender?: string;
  nation?: { nationality?: string };
  identifyNumber?: string;
  project?: { label?: string };
  dateOfBirth?: string;
  policy?: { value?: string; policyName?: string };
  inputCompany?: string;
  inputBranch?: string;
  inputter?: string;
  productName?: string;
  childrenId?: string;
  parentId?: string;
  openingDate?: string;
}
const ReviewDetail = ({ data }: { data?: ReviewDetailData }) => {
  return (
    <TransactionDetail
      physicalCard={data?.physicalCard}
      firstName={data?.firstName?.toUpperCase()}
      sureName={data?.sureName?.toUpperCase()}
      telNo={data?.telNo}
      gender={data?.gender}
      nation={data?.nation?.nationality}
      nicPassport={data?.identifyNumber}
      projectName={data?.project?.label}
      dateOfBirth={data?.dateOfBirth}
      policyName={data?.policy?.policyName}
      inputCompany={data?.inputCompany}
      inputBranch={data?.inputBranch}
      inputter={data?.inputter}
      productName={data?.productName}
      customerId={data?.childrenId}
      parentId={data?.parentId}
      openingDate={data?.openingDate}
    />
  );
};
export default CustomerCreateReview;
