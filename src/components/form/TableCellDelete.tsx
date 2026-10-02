import { Tooltip } from 'react-tooltip';
import CancelButton from '../buttons/CancelButton';
import DeleteButton from '../buttons/DeleteButton';
import Modal, { useModal } from '../common/modal';
import TrashIcon from '../Icons/TrashIcon';
interface TableCellDeleteProps {
  onClick?: () => void;
  deleteOnClick: () => void;
}
const TableCellDelete = (props: TableCellDeleteProps) => {
  const { deleteOnClick } = props;
  const { modalRef, openModal, closeModal } = useModal();
  return (
    <>
      <Modal ref={modalRef} title={'Delete Confirm?'} size="sm">
        <h4 className="mb-4">Are your sure delete this record: ?</h4>
        <div className="btn-list d-flex justify-content-end">
          <DeleteButton
            onClick={() => {
              deleteOnClick();
              closeModal();
            }}
          />
          <CancelButton onClick={closeModal} />
        </div>
      </Modal>
      <a
        className="cursor-pointer table-cell-icon-action"
        data-tooltip-id="delete-tooltip"
        data-tooltip-content="Delete"
        onClick={() => openModal()}
      >
        <TrashIcon />
        <Tooltip id="delete-tooltip" />
      </a>
    </>
  );
};
export default TableCellDelete;
