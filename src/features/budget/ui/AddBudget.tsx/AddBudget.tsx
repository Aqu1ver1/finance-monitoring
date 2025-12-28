import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import BudgetForm from './BudgetForm';
import { useBudgetStore } from '../../model/budget.store';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}


const AddBudget: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
  const setBudgetData = useBudgetStore((state) => state.setBudgetData);

  const handleSubmit = (data: { budget: number; category: string; startDate: string; endDate: string }) => {
    setBudgetData(data.budget, data.category, { startDate: data.startDate, endDate: data.endDate });
    onClose();
  }
  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition ease-out duration-300 transform"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-200 transform"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {/* Крестик закрытия */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg font-bold"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Заголовок */}
          {title && <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>}

          {/* Контент */}
           <BudgetForm onSubmit={handleSubmit}/>
        </div>
      </div>
    </Transition>
  );
};
export default AddBudget;