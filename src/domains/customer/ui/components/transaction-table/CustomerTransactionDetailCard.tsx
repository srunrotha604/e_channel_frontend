import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import TransactionDetail, {
  type TransactionDetailData,
} from './CustomerTransactionDetail';
interface TransactionDetailCardProps {
  data?: TransactionDetailData | null;
  actions?: ReactNode;
  children?: ReactNode;
}
const TransactionDetailCard = ({
  data,
  actions,
  children,
}: TransactionDetailCardProps) => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <form className="card" autoComplete="off">
      <div className="card-body">
        <div className="row justify-content-center">
          <TransactionHeader deleted={data?.deleted} status={data?.status} />
          <div className="col-md-12 py-2 px-2">
            <TransactionDetail {...data}>{children}</TransactionDetail>
          </div>
        </div>
        <div className="btn-list mt-1">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleGoBack}
          >
            Back
          </button>
          <div className="flex-grow-1" />
          {actions}
        </div>
      </div>
    </form>
  );
};
const getStatusColor = (status?: string) => {
  switch (status) {
    case 'submitted':
      return 'transaction-submitted';
    case 'approved':
      return 'transaction-approved';
    case 'confirmed':
      return 'transaction-confirmed';
    case 'bm-rejected':
    case 'dri-rejected':
      return 'transaction-rejected';
  }
};
interface TransactionHeaderProps {
  status?: string;
  deleted?: boolean;
}
const TransactionHeader = ({ status, deleted }: TransactionHeaderProps) => {
  return (
    <h2 className="card-transaction-title text-center mb-3">
      TRANSACTION
      <span className={getStatusColor(status?.toLowerCase())}>
        {`${deleted ? 'DEL_' : ''}${status?.toUpperCase()}`}
      </span>
    </h2>
  );
};
export const TransactionDetailCardContainer = ({
  children,
}: {
  children?: ReactNode;
}) => {
  return (
    <div className="page-wrapper full-height-dashboard-container justify-content-center">
      <div className="container-xl py-4">
        <div className="row justify-content-center">
          <div className="col-lg-7">{children}</div>
        </div>
      </div>
    </div>
  );
};
export default TransactionDetailCard;
