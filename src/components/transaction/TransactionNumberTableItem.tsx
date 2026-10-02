interface TransactionNumberTableItemProps {
  transactionNumber?: string;
}
function TransactionNumberTableItem({
  transactionNumber,
}: TransactionNumberTableItemProps) {
  return (
    <div className="bg-primary mb-0 rounded text-white px-2 py-1 d-inline-block">
      {transactionNumber}
    </div>
  );
}
export default TransactionNumberTableItem;
