// import React, { use, useState } from 'react'
// import { useTransactionsStore } from '../model/transactions.store';

// interface AmountInputProps {
//     amount: number;
//     setAmount: (amount: number) => void;
// }

// const AmountInput = ({ amount, setAmount }:AmountInputProps) => {
//     const currency = useTransactionsStore(state => state.selectedCurrency);
//     return (
//         <div className="mb-8">
//             <label className="block text-muted-foreground mb-2">Сумма</label>
//             <div className="relative">
//                 <input
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(parseFloat(e.target.value))}
//                     placeholder="0"
//                     className="w-full text-4xl bg-transparent border-b-2 border-border focus:border-primary outline-none pb-2"
//                     required
//                 />
//                 <span className="absolute right-0 bottom-2 text-2xl text-muted-foreground">{currency}</span>
//             </div>
//         </div>
//     )
// }

// export default AmountInput