import { Currency, Save } from 'lucide-react';
import React, { useState } from 'react'
import useCurrency from '../../../../shared/hooks/useCurrency';

interface BudgetFormProps {
  onSubmit: (data: { budget: number; category: string; startDate: string; endDate: string }) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit }) => {
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const currency = useCurrency();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || !category) return; // базовая проверка
    onSubmit({ budget: Number(budget), category, startDate, endDate });
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Ввод бюджета */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Введите сумму бюджета({currency})
        </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="1000"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      {/* Выбор периода бюджета */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            От даты
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            По дату
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      {/* Dropdown для категории */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Выберите схему разделения бюджета
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">Схема разделения</option>
          <option value="standart">50 / 30 / 20</option>
          <option value="gentle">60 / 30 / 10</option>
          <option value="accumulative">40 / 30 / 30</option>
          <option value="zero-based">Zero-based budgeting</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={!budget || category === ""}
      >
        Сохранить
      </button>
    </form>
  );
};
export default BudgetForm;