import type { MouseEventHandler, RefObject } from 'react';
import Modal from './modal';
interface ActionSaveDraftConfirmationModalProps {
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  saveDraft?: boolean;
  onSaveDraft?: MouseEventHandler<HTMLButtonElement>;
  confirm?: boolean;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
}
const ActionSaveDraftConfirmationModal = ({
  closeModal,
  modalRef,
  saveDraft,
  onSaveDraft,
  confirm,
  onConfirm,
}: ActionSaveDraftConfirmationModalProps) => {
  return (
    <Modal
      title={'Action Confirmation'}
      ref={modalRef}
      content={<p>Are you sure you want to submit this transaction?</p>}
      actions={
        <>
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
          {saveDraft && (
            <button className="btn btn-info" onClick={onSaveDraft}>
              Save Draft
            </button>
          )}
          {confirm && (
            <button className="btn btn-primary" onClick={onConfirm}>
              Confirm
            </button>
          )}
        </>
      }
    />
  );
};
export default ActionSaveDraftConfirmationModal;
