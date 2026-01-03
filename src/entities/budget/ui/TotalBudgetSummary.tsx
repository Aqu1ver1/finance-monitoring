
import BudgetIsNull from './BudgetIsNull';
import AddBudget from '../../../features/addBudget/ui/AddBudget';
import { useEffect, useState } from 'react';
import { formatDateToText } from '../../../shared/lib/dateFormatter';
import { useCurrencyStore } from '../../currency/currency.store';

interface TotalBudgetSummaryProps {
  totalSpent: number;
  totalLimit: number;
  totalPercentage: number;
  isNull: boolean;
  date: string;
}

const TotalBudgetSummary = ({ totalSpent, totalLimit, totalPercentage, isNull, date }: TotalBudgetSummaryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  isNull = totalLimit === 0;
  const currency = useCurrencyStore(state => state.selectedCurrency);
  return (
    <div className="text-white bg-background flex flex-col gap-2">
      {isNull ?
      <>
      <BudgetIsNull  handleSetBudget={() => setIsModalOpen(true)}  />
      <AddBudget 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      title="Установить бюджет" />
      </> : 
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mb-6">
          <p className="mb-2">Общий бюджет на {date}</p>
          <p className="text-3xl mb-4">{totalLimit.toLocaleString("ru-RU")} {currency}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm t">Потрачено</p>
              <p className="text-xl">{totalSpent.toLocaleString("ru-RU")} {currency}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Осталось</p>
              <p className="text-xl">{(totalLimit - totalSpent).toLocaleString("ru-RU")} {currency}</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-blue-400/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${totalPercentage}%` }}
            ></div>
          </div>
        </div>}
    </div>
  )
}

export default TotalBudgetSummary