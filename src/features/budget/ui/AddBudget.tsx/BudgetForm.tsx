import { Currency, Save } from 'lucide-react';
import React, { useState } from 'react'
import useCurrency from '../../../../shared/hooks/useCurrency';

interface BudgetFormProps {
  onSubmit: (data: { budget: number; category: string; startDate: string; endDate: string }) => void;
}

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit }) => {
  const [errors, setErrors] = useState<{ budget?: string; category?: string; date?: string }>({});
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const currency = useCurrency();
  const [startDate, setStartDate] = useState(() => formatDate(new Date()));
  const [endDate, setEndDate] = useState(() => formatDate(addMonths(new Date(), 1)));

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!budget || Number(budget) <= 0) {
      newErrors.budget = 'Введите корректную сумму бюджета';
    }

    if (!startDate || !endDate) {
      newErrors.date = 'Укажите период бюджета';
    } else if (new Date(startDate) > new Date(endDate)) {
      newErrors.date = 'Дата начала не может быть позже даты окончания';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ budget: Number(budget), category, startDate, endDate });
  };
  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {/* Ввод бюджета */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Введите сумму бюджета({currency})
        </label>
        {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="1000"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      {/* Выбор периода бюджета */}
      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
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