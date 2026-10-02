import { Tooltip } from 'react-tooltip';
import CheckIcon from '../Icons/CheckIcon';
interface SubmitButtonProps {
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
}
const SubmitButton = (props: SubmitButtonProps) => {
  const { onClick, tooltip, disabled } = props;
  return (
    <div>
      <button
        className="btn btn-primary d-none d-sm-inline-block"
        data-tooltip-id="submit-tooltip"
        data-tooltip-content={tooltip}
        onClick={onClick}
        disabled={disabled}
      >
        <CheckIcon />
        Submit
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
export default SubmitButton;
