import { useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import CopyIcon from './Icons/CopyIcon';
interface CopyClipboardProps {
  data?: string;
}
const CopyClipboard = (props: CopyClipboardProps) => {
  const { data } = props;
  const onCopy = useCallback((data: string) => {
    toast.info(`Copy "${data}" To Clipboard!`);
  }, []);
  return (
    <>
      {data != '' ? (
        <>
          <CopyToClipboard onCopy={() => onCopy(data ?? '')} text={data ?? ''}>
            <a
              id="copy-clipboard-tooltip"
              className="cursor-pointer padding-left-5"
              data-tooltip-content={`Copy "${data}" to clipboard`}
            >
              <CopyIcon />
            </a>
          </CopyToClipboard>
          <Tooltip anchorSelect="#copy-clipboard-tooltip" />
        </>
      ) : (
        ''
      )}
    </>
  );
};
export default CopyClipboard;
