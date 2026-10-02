import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import useMessage from '../../../hooks/useMessage';
import { HttpUtil } from '../../../utils/http-util';
import ButtonGroup from '../../buttons/ButtonGroup';
import CancelButton from '../../buttons/CancelButton';
import SubmitButton from '../../buttons/SubmitButton';
import Modal, { useModal } from '../../common/modal';
interface TableCellTextDeleteConfirmProps {
  success: () => void;
  uuid?: string;
  route: string;
  title?: ReactNode;
  message?: ReactNode;
  data?: unknown;
}
const TableCellTextDeleteConfirm = (props: TableCellTextDeleteConfirmProps) => {
  const { success, route, title, message, data } = props;
  const { modalRef, openModal, closeModal } = useModal();
  const { showErrorResponseMessage } = useMessage();
  const onSubmit = async () => {
    try {
      await HttpUtil.delete(route, data);
      toast.success('Success!');
      closeModal();
      success();
    } catch (error) {
      showErrorResponseMessage(error);
    }
  };
  return (
    <>
      <Modal ref={modalRef} title={title} size="sm">
        <label className="mb-3">{message}</label>
        <ButtonGroup>
          <SubmitButton tooltip="Submit" onClick={() => onSubmit()} />
          <CancelButton tooltip="Cancel" onClick={() => closeModal()} />
        </ButtonGroup>
      </Modal>
      <span
        className="text-danger t-udl"
        onClick={() => {
          openModal();
        }}
      >
        Delete
      </span>
    </>
  );
};
export default TableCellTextDeleteConfirm;
