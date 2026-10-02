import { Tooltip } from 'react-tooltip';
import CheckIcon from '../Icons/CheckIcon';
interface DeleteButtonProps {
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
  loading?: boolean;
}
const DeleteButton = (props: DeleteButtonProps) => {
  const { onClick, tooltip, disabled, loading } = props;
  return (
    <div>
      <button
        className={`btn btn-primary d-none d-sm-inline-block${
          loading ? `disabled` : ``
        }`}
        data-tooltip-id="submit-tooltip"
        data-tooltip-content={tooltip}
        onClick={onClick}
        disabled={disabled}
      >
        {loading ? (
          <div>
            <div>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Loading
              <span className="animated-dots" />
            </div>
          </div>
        ) : (
          <>
            <CheckIcon />
            Confirm!
          </>
        )}
      </button>
      <button
        className="btn btn-primary d-sm-none btn-icon"
        data-tooltip-id="submit-tooltip"
        data-tooltip-content={tooltip}
        onClick={onClick}
        disabled={disabled}
      >
        <CheckIcon />
      </button>
      <Tooltip id="submit-tooltip" />
    </div>
  );
};
export default DeleteButton;
