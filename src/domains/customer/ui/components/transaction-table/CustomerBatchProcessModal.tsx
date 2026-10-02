import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { IoRemove } from 'react-icons/io5';
import Modal from '../../../../../components/common/modal';
import type { CustomerTransaction } from '../../../entities';
interface TransactionBatchProccessModalData {
  selectedCustomerList?: CustomerTransaction[];
  tabStatus?: string | null;
}
interface TransactionBatchProccessModalProps {
  data?: TransactionBatchProccessModalData;
  actions?: ReactNode;
  handleRemoveCustomer: (item: CustomerTransaction) => void;
  loading?: boolean;
  closeModal?: () => void;
}
// eslint-disable-next-line react/display-name
const TransactionBatchProccessModal = forwardRef<
  HTMLDivElement,
  TransactionBatchProccessModalProps
>(({ data, actions, handleRemoveCustomer }, ref) => {
  return (
    <Modal
      size="xl"
      title={`Transaction Selected ${data?.selectedCustomerList?.length}`}
      ref={ref}
      bodyClassName="px-0 py-0 mb-2 vh-100 d-flex"
      headerClassName="px-4"
      actions={actions}
    >
      <div
        className="card-table table-responsive border-top"
        style={{ flex: 1 }}
      >
        <table className="table table-striped table-vcenter table-hover">
          <thead className="position-sticky top-0 ">
            <tr>
              <th>#</th>
              <th>TRANSACTION</th>
              <th>Name</th>
              <th>Tel No.</th>
              <th>Gender</th>
              <th>Nationality</th>
              <th>NIC/Passport</th>
              <th style={{ width: '10%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.selectedCustomerList?.map((item, index) => (
              <tr key={item.transactionCode} role="button">
                <>
                  <td className="text-muted">{index + 1}</td>
                  <td className="text-primary">{item.transactionNumber}</td>
                  <td className="text-muted">
                    {item.sureName + ' ' + item.firstName}
                  </td>
                  <td className="text-muted">{item.telNo}</td>
                  <td className="text-muted">{item.gender}</td>
                  <td className="text-muted">{item.nation}</td>
                  <td className="text-muted">{item.nicPassport}</td>
                  <td className="text-muted">
                    <button
                      onClick={() => {
                        handleRemoveCustomer(item);
                      }}
                      className="btn btn-default btn-circle"
                    >
                      <IoRemove color="red" fontSize="18px" />
                    </button>
                  </td>
                </>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
});
export default TransactionBatchProccessModal;
