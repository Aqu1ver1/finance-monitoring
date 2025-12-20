import React from 'react'
import { useCurrencyStore } from '../../settings/currency/model/currency.store';

interface TotalBudgetSummaryProps {
  totalSpent: number;
  totalLimit: number;
  totalPercentage: number;
  isNull: boolean;
}

const TotalBudgetSummary = ({ totalSpent, totalLimit, totalPercentage, isNull }: TotalBudgetSummaryProps) => {
  function handleSetBudget() {
    
  }
  
  const currency = useCurrencyStore(state => state.selectedCurrency);
  return (
    <div className="text-primary bg-background  mb-8">
      <h2 className="mb-6">Бюджет на месяц</h2>
      {isNull ?
        <div>
          <p className="mb-2">Общий бюджет</p>
          <button className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-2xl text-blue-600 font-medium transition-all active:scale-95"
          onClick={handleSetBudget}>
            Установить бюджет
          </button>
        </div> :
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mb-6">
          <p className="mb-2">Общий бюджет</p>
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