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
  showHeader?: boolean;
  autoClose?: boolean;
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
      showHeader = true,
      autoClose = false,
    },
    ref
  ) => {
    return (
      <div
        className={clsx('modal', { fade: !noTransition })}
        ref={ref}
        tabIndex={-1}
        aria-hidden="true"
        data-bs-backdrop={autoClose ? 'static' : true}
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
          <div className="modal-content position-relative">
            {showHeader && (
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
            )}
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
const nextModalZIndex = () => {
  const zIndices = [
    ...document.querySelectorAll<HTMLElement>('.modal.show, .modal-backdrop'),
  ].map((el) => Number(getComputedStyle(el).zIndex) || 0);
  const max = zIndices.length ? Math.max(...zIndices) : 1050;
  return max + 20;
};
export const useModal = <T = unknown,>() => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const openModal = (data?: T) => {
    setData(data ?? null);
    setOpen(true);
    setTimeout(() => {
      const element = modalRef.current;
      if (!element) return;
      const myModal = new bootstrap.Modal(element);
      element.addEventListener(
        'shown.bs.modal',
        () => {
          const modalZIndex = nextModalZIndex();
          element.style.zIndex = String(modalZIndex);
          const backdrops =
            document.querySelectorAll<HTMLElement>('.modal-backdrop');
          const ownBackdrop = backdrops[backdrops.length - 1];
          if (ownBackdrop) {
            ownBackdrop.style.zIndex = String(modalZIndex - 1);
          }
        },
        { once: true }
      );
      myModal.show();
    }, 10);
  };
  const closeModal = () => {
    setOpen(false);
    const myModal = bootstrap.Modal.getInstance(modalRef.current);
    if (myModal) {
      myModal.hide();
    }
    const closingBackdrops =
      document.querySelectorAll<HTMLElement>('.modal-backdrop');
    const ownClosingBackdrop = closingBackdrops[closingBackdrops.length - 1];
    if (ownClosingBackdrop) {
      ownClosingBackdrop.remove();
    }
    if (!document.querySelector('.modal.show')) {
      document.body.classList.remove('modal-open');
      document.body.style.cssText = '';
    }
  };
  return { openModal, closeModal, modalRef, open, data };
};
export default Modal;
