import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import Modal from '../components/common/modal';
import { HttpUtil } from '../utils/http-util';
import { ROUTE_API } from '../utils/route-util';
import IssueDateDetailModal from './IssueDateDetailModal';
interface IssueDateModalItem {
  sureName?: string;
  firstName?: string;
  issueDateStatus?: boolean | null;
  customerIssueDate?: {
    cardNumber?: string;
    issueDate?: string;
    remark?: string;
    secureCode?: string;
  };
}
interface IssueDateModalProps {
  open?: boolean;
  closeModal?: () => void;
  modalRef?: RefObject<HTMLDivElement>;
  item?: IssueDateModalItem | null;
  onStatusChange?: (status: string) => void;
  arrCustomer?: unknown;
  onUpdate?: (cardNumber: string) => void;
}
const IssueDateModal = ({
  open,
  closeModal,
  modalRef,
  item,
  onStatusChange,
  onUpdate,
}: IssueDateModalProps) => {
  const [, setIssueStatus] = useState<boolean | null>(null);
  const [showDetailIssueModal, setShowDetailIssueModal] = useState(false);
  const [remark, setRemark] = useState('');
  const hasIssueDate = !!item?.customerIssueDate?.issueDate;
  useEffect(() => {
    if (open) {
      setIssueStatus(item?.issueDateStatus ?? null);
      const existingRemark = item?.customerIssueDate?.remark || '';
      setRemark(existingRemark);
    }
  }, [item, open]);
  const updateCardConfirmation = async (status: 'confirm' | 'cancel') => {
    const secureCode = item?.customerIssueDate?.secureCode;
    if (!secureCode) return;
    try {
      const response = await HttpUtil.put<{ message?: string }>(
        ROUTE_API.operationCustomerCardConfirmation,
        {
          secureCode,
          remark: remark || '',
          status,
        }
      );
      if (response?.status === 200) {
        onStatusChange?.(status);

        if (typeof onUpdate === 'function') {
          const cardNumber = item?.customerIssueDate?.cardNumber;
          if (cardNumber) {
            onUpdate(cardNumber);
          }
        }
      } else {
        console.error(
          'Update failed:',
          response?.data?.message || 'Unknown error'
        );
      }
    } catch (err) {
      console.error(
        'Error during update:',
        err instanceof Error ? err.message : err
      );
    }
  };
  const handleYes = async () => {
    await updateCardConfirmation('confirm');
    setIssueStatus(true);
    closeModal?.();
    setTimeout(() => setShowDetailIssueModal(true), 150);
  };
  const handleNo = async () => {
    await updateCardConfirmation('cancel');
    setIssueStatus(false);
    closeModal?.();
  };
  return (
    <>
      {open && (
        <Modal ref={modalRef} title="Date of Issue Card" closeButton>
          <div>
            {hasIssueDate ? (
              <>
                <div className="mb-3 pb-1">
                  <p>Would you like to receive this issue card?</p>
                  <label className="form-label">Remark:</label>
                  <textarea
                    className="form-control"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    rows={3}
                    placeholder="Enter a remark..."
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-danger" onClick={handleNo}>
                    No
                  </button>
                  <button className="btn btn-primary" onClick={handleYes}>
                    Yes
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <p>No issue date is available for this card.</p>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
      {showDetailIssueModal && (
        <IssueDateDetailModal
          key="issue-detail-modal"
          open={showDetailIssueModal}
          onClose={() => setShowDetailIssueModal(false)}
          item={item}
        />
      )}
    </>
  );
};
export default IssueDateModal;
