import React from 'react'
import { useCurrencyStore } from '../../settings/currency/model/currency.store';

const TotalBudgetSummary = ({ totalSpent, totalLimit, totalPercentage }: { totalSpent: number; totalLimit: number; totalPercentage: number }) => {
const currency = useCurrencyStore(state => state.selectedCurrency);
  return (
    <div className="text-white mb-8">
        <h2 className="mb-6">Бюджет на месяц</h2>
        
        {/* Total Budget Summary */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mb-6">
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
        </div>
      </div>
  )
}

export default TotalBudgetSummary