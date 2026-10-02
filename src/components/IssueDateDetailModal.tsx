import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import Modal from '../components/common/modal';
import { HttpUtil } from '../utils/http-util';
import { ROUTE_API } from '../utils/route-util';
interface IssueDateDetailItem {
  sureName?: string;
  firstName?: string;
  customerIssueDate?: {
    cardNumber?: string;
    issueDate?: string;
  };
}
interface IssueConfirmationDetail {
  inputter?: string;
  creationDate?: string;
  remark?: string;
}
interface IssueDateDetailModalProps {
  open?: boolean;
  onClose?: () => void;
  modalRef?: RefObject<HTMLDivElement>;
  item?: IssueDateDetailItem | null;
}
const IssueDateDetailModal = ({
  open,
  onClose,
  modalRef,
  item,
}: IssueDateDetailModalProps) => {
  const [detail, setDetail] = useState<IssueConfirmationDetail | null>(null);
  useEffect(() => {
    if (!open || !item?.customerIssueDate?.cardNumber) return;
    const fetchDetail = async () => {
      try {
        const secureCode = item.customerIssueDate?.cardNumber;
        const res = await HttpUtil.get<{
          data?: IssueConfirmationDetail;
        }>(
          ROUTE_API.operationCustomerCardConfirmation +
            `?secureCode=${secureCode}`
        );
        setDetail(res?.data?.data || {});
      } catch (err) {
        console.error('Failed to fetch confirmation:', err);
      }
    };
    fetchDetail();
  }, [open, item]);
  if (!open || !item) return null;
  return (
    <Modal ref={modalRef} title="Date of Issue Card" closeButton>
      <div className="pb-1">
        <p>
          <strong className="mx-2">Insured Name:</strong>{' '}
          {`${item?.sureName || ''} ${item?.firstName || ''}`.trim()}
        </p>
        <p>
          <strong className="mx-2">Issue Date Card:</strong>
          {item?.customerIssueDate?.issueDate || 'N/A'}
        </p>
        <p>
          <strong className="mx-2">Confirm by:</strong>
          {detail?.inputter || 'N/A'}
        </p>
        <p>
          <strong className="mx-2">Collected on:</strong>
          {detail?.creationDate
            ? new Date(detail.creationDate)
                .toLocaleString('en-GB', {
                  hour12: true,
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
                .replace('am', 'AM')
                .replace('pm', 'PM')
            : 'N/A'}
        </p>
        <div className="d-flex">
          <p className="mb-1 mx-2">
            <strong>Remark:</strong>
          </p>
          <p>{detail?.remark || 'N/A'}</p>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default IssueDateDetailModal;
