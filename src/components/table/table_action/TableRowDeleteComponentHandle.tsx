import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import useMessage from '../../../hooks/useMessage';
import { HttpUtil } from '../../../utils/http-util';
import ButtonGroup from '../../buttons/ButtonGroup';
import CancelButton from '../../buttons/CancelButton';
import SubmitButton from '../../buttons/SubmitButton';
import Modal, { useModal } from '../../common/modal';
interface TableRowDeleteComponentHandleProps {
  success: () => void;
  uuid?: string;
  route: string;
  title?: ReactNode;
  message?: ReactNode;
}
const TableRowDeleteComponentHandle = (
  props: TableRowDeleteComponentHandleProps
) => {
  const { success, uuid, route, title, message } = props;
  const { modalRef, openModal, closeModal } = useModal();
  const { showErrorResponseMessage } = useMessage();
  const onSubmit = async () => {
    try {
      const data = {
        uuid: uuid,
      };
      await HttpUtil.delete(route, data);
      toast.success('Success!');
      success();
      closeModal();
    } catch (error) {
      showErrorResponseMessage(error);
    }
  };
  return (
    <>
      <Modal ref={modalRef} title={title} size="sm">
        <p className="text-start">{message}</p>
        <ButtonGroup>
          <SubmitButton tooltip="Submit" onClick={() => onSubmit()} />
          <CancelButton tooltip="Cancel" onClick={() => closeModal()} />
        </ButtonGroup>
      </Modal>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-trash-x cursor-pointer"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ff2825"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={() => {
          openModal();
        }}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7h16" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        <path d="M10 12l4 4m0 -4l-4 4" />
      </svg>
    </>
  );
};
export default TableRowDeleteComponentHandle;
