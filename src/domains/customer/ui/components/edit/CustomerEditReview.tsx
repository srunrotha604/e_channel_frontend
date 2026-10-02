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
import { updateCustomerTransaction } from '../../../interface-adapters';
import { buildCustomerEditDto } from '../../../use-cases';
import TransactionDetail from '../transaction-table/CustomerTransactionDetail';
interface CustomerEditReviewProps {
  handleBackStep?: () => void;
  handleSubmitted: (
    responseData: unknown,
    submitData: { status?: string }
  ) => void;
  productName?: string;
}
const CustomerEditReview = (props: CustomerEditReviewProps) => {
  const { user, selectedBranch, selectedCompany } = useAuth();
  const { handleBackStep, handleSubmitted, productName } = props;
  const { handleSubmit, getValues } = useFormContext();
  const formData = getValues();
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const { openModal, closeModal, modalRef } = useModal();
  const { hasPermissionProccessTransaction } = useAuth();
  const params = useParams();
  const onSubmit = async (data: Record<string, any>) => {
    const isDraft = data.saveDraft === true;
    try {
      openSpinner();
      const summaryData = buildCustomerEditDto(data, {
        productCode: params.productCode,
        isDraft,
      });
      const responseData = await updateCustomerTransaction(summaryData);
      delay([
        closeSpinner,
        () => {
          const msg = isDraft
            ? 'Draft saved successfully'
            : 'Record created successfully';
          toast.success(msg);
          handleSubmitted(responseData, summaryData);
          closeModal();
        },
      ]);
    } catch (error) {
      delay(() => {
        closeSpinner();
        const baseMsg = isDraft
          ? 'Failed to save draft'
          : 'Failed to create record';
        if (axios.isAxiosError(error)) {
          handleApiError(error, baseMsg);
        }
      });
    }
  };
  return (
    <div className="page-wrapper justify-content-center">
      <div className="page-body">
        <div className="container-xl py-2">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-transaction-title text-center mb-3">
                    <span className="transaction-approved">REVIEW</span>
                  </h2>
                  <form>
                    <div className="row justify-content-center">
                      <div className="col-md-12">
                        <ReviewDetail
                          data={{
                            ...formData,
                            productName,
                            inputter: `${
                              user?.email ||
                              `${
                                user?.firstName || '' + user?.lastName || ''
                              }` ||
                              ''
                            }`,
                            inputBranch: selectedBranch?.branchName,
                            inputCompany: selectedCompany?.companyName,
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-footer">
                      <div className="btn-list">
                        <button
                          className="btn btn-secondary d-none d-sm-inline-block"
                          onClick={handleBackStep}
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
            onSubmit({ ...data, saveDraft: true });
          })}
          onConfirm={handleSubmit((data) => {
            onSubmit({ ...data, saveDraft: false });
          })}
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
  nicPassport?: string;
  project?: { label?: string };
  dateOfBirth?: string;
  policy?: { value?: string; policyName?: string };
  inputCompany?: string;
  inputBranch?: string;
  inputter?: string;
  productName?: string;
  customerId?: string;
  parentId?: string;
  openingDate?: string;
}
const ReviewDetail = ({ data }: { data?: ReviewDetailData }) => {
  return (
    <TransactionDetail
      physicalCard={data?.physicalCard}
      firstName={data?.firstName}
      sureName={data?.sureName}
      telNo={data?.telNo}
      gender={data?.gender}
      nation={data?.nation?.nationality}
      nicPassport={data?.nicPassport}
      projectName={data?.project?.label}
      dateOfBirth={data?.dateOfBirth}
      policyName={data?.policy?.policyName}
      inputCompany={data?.inputCompany}
      inputBranch={data?.inputBranch}
      inputter={data?.inputter}
      productName={data?.productName}
      customerId={data?.customerId}
      parentId={data?.parentId}
      openingDate={data?.openingDate}
    />
  );
};
export default CustomerEditReview;
