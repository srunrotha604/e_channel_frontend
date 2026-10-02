import { forwardRef, useState } from 'react';
import Modal, { useModal } from './modal/index';
interface SpinnerProps {
  title?: string;
}
// eslint-disable-next-line react/display-name
const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ title = 'Loading' }, ref) => {
    return (
      <Modal
        noTransition
        size="sm"
        bodyClassName="px-0 py-4 spinner-container"
        headerClassName="min-height-0"
        closeButton={false}
        ref={ref}
      >
        <div className="d-flex column flex-column justify-content-center align-items-center">
          <div
            className="spinner-border text-primary mr-5"
            style={{ width: '3rem', height: '3rem' }}
            role="status"
          ></div>
          <h2 className="mb-0 mt-2">{title}</h2>
        </div>
      </Modal>
    );
  }
);
export const useSpinner = (defaultTitle = 'Loading...') => {
  const { modalRef, openModal, closeModal } = useModal();
  const [state, setState] = useState<{ defaultTitle: string; title?: string }>({
    defaultTitle,
  });
  const [loading, setLoading] = useState(false);
  const openSpinner = (
    { title }: { title?: string } = { title: defaultTitle }
  ) => {
    setState((prev) => ({ ...prev, title }));
    setLoading(true);
    openModal({ disableBackdrop: true });
  };
  const closeSpinner = () => {
    setState((prev) => ({ ...prev }));
    setLoading(false);
    closeModal();
  };
  return {
    spinnerState: {
      ref: modalRef,
      title: state.title,
      loading,
    },
    openSpinner,
    closeSpinner,
  };
};
export default Spinner;
