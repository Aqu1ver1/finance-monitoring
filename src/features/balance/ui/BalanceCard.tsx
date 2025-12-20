// import React from 'react'
// import { TrendingUp, TrendingDown } from "lucide-react";
// import { useCurrencyStore } from "../../settings/currency/model/currency.store";
// import { useTransactionsStore } from "../../transactions/model/transactions.store";

// const BalanceCard = () => {
//     return (
//         <div className="mb-8 ">
//             <p className=" mb-1">Общий баланс</p>
//             <h1 className="text-5xl mb-4">{balance.toLocaleString("ru-RU")} {currency}</h1>
//             <div className="flex gap-4">
//                 <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
//                     <TrendingUp className="w-4 h-4 text-green-600" />
//                     <div>
//                         <p className="text-xs text-green-700">Доход</p>
//                         <p className="text-green-900">{totalIncome.toLocaleString("ru-RU")} {currency}</p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
//                     <TrendingDown className="w-4 h-4 text-red-600" />
//                     <div>
//                         <p className="text-xs text-red-700">Расход</p>
//                         <p className="text-red-900">{totalExpenses.toLocaleString("ru-RU")} {currency}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default BalanceCard