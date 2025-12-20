import { useTransactionsStore } from '../model/transactions.store';
import CategoryTransactions from '../../../shared/ui/CategoryTransactions';



const RecentTransactions = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  return (
    <div className="space-y-3">
      {transactions.slice(0, 5).map((transaction) => (
        <CategoryTransactions key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}

export default RecentTransactions