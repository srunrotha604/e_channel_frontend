import clsx from 'clsx';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';
import { copyTextToClipboard } from '../../utils/copy-text-to-clipboard';
interface TransactionNumberProps {
  transactionNumber?: string;
  label?: string;
  disableLabel?: boolean;
  disableGutter?: boolean;
}
const TransactionNumber = ({
  transactionNumber,
  label = 'Transaction No.',
  disableLabel = false,
  disableGutter = false,
}: TransactionNumberProps) => {
  return (
    <div
      className={clsx('fs-5 transaction-number-label', {
        ['mb-2']: !disableGutter,
      })}
    >
      {!disableLabel ? label : ''}
      <b>
        <span
          className="fs-4 text-primary-blue d-inline-block text-underline transaction-number-label"
          onClick={() => {
            toast.success(`${label} ${transactionNumber} Copied to Clipboard`);
            copyTextToClipboard(transactionNumber ?? '');
          }}
        >
          {transactionNumber}
          <MdContentCopy size={16} />
        </span>
      </b>
    </div>
  );
};
export default TransactionNumber;
