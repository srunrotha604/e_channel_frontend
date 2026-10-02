import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import Modal from '../../../../../components/common/modal';
import TransactionNumberTableItem from '../../../../../components/transaction/TransactionNumberTableItem';
import { formatDay } from '../../../../../utils/format-day';
import { pluralize } from '../../../../../utils/pluralize';
import type { CustomerTransaction } from '../../../entities';
import ComponentStatus from '../ComponentStatus';
interface ExistedPolicyModalProps {
  data?: CustomerTransaction[];
  actions?: ReactNode;
  loading?: boolean;
}
const ExistedPolicyModal = forwardRef<HTMLDivElement, ExistedPolicyModalProps>(
  function ExistedPolicyModal({ data, actions }, ref) {
    return (
      <Modal
        size="xl"
        title={`${data?.length} ${pluralize(
          'policy',
          data?.length ?? 0
        )} existed`}
        ref={ref}
        bodyClassName="px-0 py-0 mb-2 vh-100 d-flex"
        headerClassName="px-4"
        actions={actions}
      >
        <div
          className="card-table table-responsive border-top"
          style={{ flex: 1 }}
        >
          <table className="table table-striped table-vcenter">
            <thead className="position-sticky top-0 ">
              <tr>
                <th>TRANSACTION</th>
                <th>INSURED NAME</th>
                <th>PROJECT</th>
                <th>PRODUCT</th>
                <th>DATE</th>
                <th>USER</th>
                <th>BRANCH</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr key={item.transactionCode} className="text-nowrap">
                  <td>
                    <TransactionNumberTableItem
                      transactionNumber={item.transactionNumber}
                    ></TransactionNumberTableItem>
                  </td>
                  <td className="text-muted">
                    {item.sureName + ' ' + item.firstName}
                  </td>
                  <td className="text-muted">{item.projectName}</td>
                  <td className="text-muted">{item.productCode}</td>
                  <td className="text-muted">
                    {formatDay(item.inputDateTime)}
                  </td>
                  <td className="text-muted">{item.inputter}</td>
                  <td className="text-muted">{item.inputBranch}</td>
                  <td>
                    <ComponentStatus status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    );
  }
);
export default ExistedPolicyModal;
