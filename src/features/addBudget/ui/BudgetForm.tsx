// features/budget/ui/BudgetForm.tsx

import React, { useState } from 'react';
import { useCurrencyStore } from '../../../features/currency/currency.store';
import { BUDGET_SCHEMES, type BudgetSchemeId } from '../budgetConfig';

interface BudgetFormData {
  amount: number;
  schemeId: BudgetSchemeId;
  dateCreate: Date;
}

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit }) => {
  const [errors, setErrors] = useState<{ amount?: string; scheme?: string }>({});
  const [amount, setAmount] = useState<string>('');
  const [schemeId, setSchemeId] = useState<BudgetSchemeId | ''>('');
  const currency = useCurrencyStore(state => state.selectedCurrency);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Введите корректную сумму бюджета';
    }

    if (!schemeId) {
      newErrors.scheme = 'Выберите схему разделения';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !schemeId) return;

    onSubmit({
      amount: Number(amount),
      schemeId,
      dateCreate: new Date()
    });
  };

  return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Ввод бюджета */}
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">
                    Введите сумму бюджета ({currency})
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full p-2 border rounded-lg"
                />
                {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
            </div>

            {/* Выбор схемы */}
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">
                    Выберите схему разделения бюджета
                </label>
                <p className="block text-[14px]">Потребности, Желания, Накопления</p>
                <select
                    value={schemeId}
                    onChange={(e) => setSchemeId(e.target.value as BudgetSchemeId)}
                    className="w-full h-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                    <option value="" disabled hidden>
                        Выберите схему
                    </option>
                    {Object.values(BUDGET_SCHEMES).map((scheme) => (
                        <option key={scheme.id} value={scheme.id}>
                            {scheme.name}
                        </option>
                    ))}
                </select>
                {errors.scheme && (
                    <p className="text-red-500 text-sm mt-1">{errors.scheme}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={!amount || !schemeId}
            >
                Сохранить
            </button>
        </form >
    );
};
export default BudgetForm;