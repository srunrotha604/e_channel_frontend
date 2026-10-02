import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { ROUTE_PATH } from '../../../../../utils/route-util';
import { STATUS } from '../../../entities';
import TransactionDetail from '../transaction-table/CustomerTransactionDetail';
interface CustomerTransationSubmitData {
  transaction?: string;
  transactionDateTime?: string;
  [key: string]: unknown;
}
interface CustomerTransationSubmitProps {
  data?: unknown;
  productName?: string;
}
const CostomerTransationSubmit = (props: CustomerTransationSubmitProps) => {
  const { data, productName } = props;
  const { getValues } = useFormContext();
  const { user, selectedBranch, selectedCompany } = useAuth();
  const navigate = useNavigate();
  const formData = getValues();
  return (
    <div className="page-wrapper">
      <div className="page-body">
        <div className="container-xl  py-4">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-7">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-transaction-title text-center mb-3">
                    TRANSACTION{' '}
                    <span className="transaction-submitted"> SUBMITTED</span>
                  </h2>
                  <div className="row justify-content-center">
                    <div className="col-md-12 py-2 px-2">
                      <ReviewDetail
                        data={{
                          ...(data as CustomerTransationSubmitData),
                          ...formData,
                          productName,
                          inputter: `${
                            user?.email ||
                            `${user?.firstName || '' + user?.lastName || ''}` ||
                            ''
                          }`,
                          inputBranch: selectedBranch?.branchName,
                          inputCompany: selectedCompany?.companyName,
                          inputDateTime: (data as CustomerTransationSubmitData)
                            ?.transactionDateTime,
                          status: STATUS.Submitted,
                          transactionNumber: (
                            data as CustomerTransationSubmitData
                          )?.transaction,
                        }}
                      />
                    </div>
                  </div>{' '}
                  <div className="btn-list">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => {
                        navigate(ROUTE_PATH.dashboard);
                      }}
                    >
                      Go to Home
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        navigate(ROUTE_PATH.customerCreate);
                      }}
                    >
                      Add New
                    </button>
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
interface ReviewDetailData {
  policy?: { policyName?: string; value?: string };
  firstName?: string;
  sureName?: string;
  telNo?: string;
  gender?: string;
  nation?: { nationality?: string };
  identifyNumber?: string;
  nicPassport?: string;
  project?: { label?: string };
  dateOfBirth?: string;
  inputCompany?: string;
  inputBranch?: string;
  inputter?: string;
  productName?: string;
  openingDate?: string;
  parentId?: string;
  childrenId?: string;
  status?: string;
  inputDateTime?: string;
  transactionNumber?: string;
  deleted?: boolean;
}
const ReviewDetail = ({ data }: { data?: ReviewDetailData }) => {
  return (
    <TransactionDetail
      status={data?.status}
      inputDateTime={data?.inputDateTime}
      transactionNumber={data?.transactionNumber}
      deleted={data?.deleted}
      policyName={data?.policy?.policyName}
      remark=""
      firstName={data?.firstName}
      sureName={data?.sureName}
      telNo={data?.telNo}
      gender={data?.gender}
      nation={data?.nation?.nationality}
      nicPassport={data?.identifyNumber || data?.nicPassport}
      projectName={data?.project?.label}
      dateOfBirth={data?.dateOfBirth}
      inputCompany={data?.inputCompany}
      inputBranch={data?.inputBranch}
      inputter={data?.inputter}
      productName={data?.productName}
      openingDate={data?.openingDate}
      parentId={data?.parentId}
      customerId={data?.childrenId}
    />
  );
};
export default CostomerTransationSubmit;
