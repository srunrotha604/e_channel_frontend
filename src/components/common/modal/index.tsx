import clsx from 'clsx';
import type { ReactNode } from 'react';
import { forwardRef, useRef, useState } from 'react';
const modalSize = {
  sm: 'modal-sm',
  lg: 'modal-lg',
  xl: 'modal-xl',
};
export interface ModalProps {
  title?: ReactNode;
  content?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  size?: keyof typeof modalSize;
  closeButton?: boolean;
  bodyClassName?: string;
  headerClassName?: string;
  noTransition?: boolean;
}
// eslint-disable-next-line react/display-name
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      title,
      content,
      children,
      actions,
      size,
      closeButton = true,
      bodyClassName = '',
      headerClassName = '',
      noTransition = false,
    },
    ref
  ) => {
    return (
      <div
        className={clsx('modal', { fade: !noTransition })}
        ref={ref}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className={clsx(
            'modal-dialog',
            'modal-dialog-centered',
            'modal-dialog-scrollable',
            {
              [size ? modalSize[size] : '']: size,
            }
          )}
        >
          <div className="modal-content bg-white position-relative ">
            <div className={clsx('modal-header', headerClassName)}>
              <h5 className="modal-title">{title}</h5>
              {closeButton && (
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              )}
            </div>
            <div className={clsx('modal-body ', bodyClassName)}>
              {content || children}
            </div>
            {actions && <div className="modal-footer">{actions}</div>}
          </div>
        </div>
      </div>
    );
  }
);
export const useModal = <T = unknown,>() => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const openModal = (data?: T) => {
    setData(data ?? null);
    setOpen(true);
    setTimeout(() => {
      const myModal = new bootstrap.Modal(modalRef.current);
      myModal.show();
    }, 10);
  };
  const closeModal = () => {
    setOpen(false);

    const myModal = bootstrap.Modal.getInstance(modalRef.current);
    if (myModal) {
      myModal.hide();
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
      document.body.classList.remove('modal-open');
      document.body.style.cssText = '';
    }
  };
  return { openModal, closeModal, modalRef, open, data };
};
export default Modal;
