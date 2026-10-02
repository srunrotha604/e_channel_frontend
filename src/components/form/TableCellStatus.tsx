import CancelButton from '../buttons/CancelButton';
import DeleteButton from '../buttons/DeleteButton';
import Modal, { useModal } from '../common/modal';
interface TableCellStatusProps {
  onClick?: () => void;
  statusOnClick: () => void;
  status?: string;
}
const TableCellStatus = (props: TableCellStatusProps) => {
  const { statusOnClick, status } = props;
  const { modalRef, openModal, closeModal } = useModal();
  return (
    <td>
      <Modal ref={modalRef} title={'Status Confirm?'} size="sm">
        <h4 className="mb-4">Are your sure change status?</h4>
        <div className="btn-list d-flex justify-content-end">
          <DeleteButton
            onClick={() => {
              statusOnClick();
              closeModal();
            }}
          />
          <CancelButton onClick={closeModal} />
        </div>
      </Modal>
      <>
        <a
          className="cursor-pointer table-cell-icon-action"
          data-tooltip-id="delete-tooltip"
          data-tooltip-content="Status"
          onClick={() => openModal()}
        >
          {status === 'Active' ? (
            <td className="text-primary">{status}</td>
          ) : (
            <td className="text-danger">{status}</td>
          )}
        </a>
      </>
    </td>
  );
};
export default TableCellStatus;
