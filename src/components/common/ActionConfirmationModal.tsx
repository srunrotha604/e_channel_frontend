import type { ReactNode, RefObject } from 'react';
import { useState } from 'react';
import Modal from './modal';
interface ActionConfirmationModalProps {
  modalRef: RefObject<HTMLDivElement>;
  isApprove: boolean | null;
  closeModal: () => void;
  onApprove?: () => void;
  onReject?: (remark: string) => void;
  rejectPlaceHolder?: string;
  confirmText?: string;
  confirmMessageText?: ReactNode;
}
const ApproveRejectConfirmationModal = ({
  modalRef,
  isApprove,
  closeModal,
  onApprove,
  onReject,
  rejectPlaceHolder = 'Reason...',
  confirmText = 'approve',
  confirmMessageText,
}: ActionConfirmationModalProps) => {
  const [rejectRemark, setRejectRemark] = useState('');
  return (
    <Modal
      title={'Action Confirmation'}
      ref={modalRef}
      content={
        <div>
          {confirmMessageText ? (
            confirmMessageText
          ) : (
            <p>
              Are you sure you want to {isApprove ? confirmText : 'reject'} this
              transaction?
            </p>
          )}
          {!isApprove && (
            <div className="form-group mb-3">
              <label className="form-label required" htmlFor="remark">
                Remark
              </label>
              <textarea
                id="remark"
                value={rejectRemark}
                onChange={(e) => setRejectRemark(e.target.value)}
                className="form-control"
                rows={5}
                placeholder={rejectPlaceHolder}
              />
            </div>
          )}
        </div>
      }
      actions={
        <>
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
          <button
            disabled={!isApprove && rejectRemark.trim().length === 0}
            className="btn btn-primary"
            onClick={() => {
              if (isApprove === null) {
                return;
              }
              if (isApprove) {
                onApprove && onApprove();
              } else {
                onReject && onReject(rejectRemark);
              }
              closeModal();
            }}
          >
            Confirm
          </button>
        </>
      }
    />
  );
};
export default ApproveRejectConfirmationModal;
