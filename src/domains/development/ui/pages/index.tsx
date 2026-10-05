import { useRef } from 'react';

const DevelopmentPage = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleModalTrigger = () => {
    const modal = new bootstrap.Modal(modalRef.current);
    modal.show();
  };

  return (
    <div style={{ height: '500px', background: 'white' }}>
      <button onClick={handleModalTrigger} className="btn btn-primary">
        Trigger modal
      </button>
      <div
        className="modal fade"
        id="exampleModalCenter"
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DevelopmentPage;
