import { useState } from "react";
import { X } from "lucide-react";
import { useCurrencyStore } from "../features/currency/currency.store";
import { useTransactionsStore } from "../entities/transactions/transactions.store";
import { defaultCategories } from "../shared/config/defaultCategories";
import type { TransactionType } from "../shared/lib/transactionType";
import AddCategoryCard from "../features/customCategories/ui/AddCategoryCard";
import { useCustomCategoriesStore } from "../features/customCategories/customCategories.store";
import EditCategoryCard from "../features/customCategories/ui/editCategoryCard";



interface AddTransactionProps {
  onClose: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onClose }) => {
  const [type, setType] = useState<TransactionType["id"]>(-1);
  const [amount, setAmount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const currency = useCurrencyStore(state => state.selectedCurrency);
  const addTransaction = useTransactionsStore(state => state.addTransaction);
  const customCategory = useCustomCategoriesStore(state => state.categories);
  const allCategories = [...defaultCategories, ...customCategory];
  
  console.log(defaultCategories.length);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedCategory) return;

    const categoryName =
      allCategories.find(cat => cat.id === selectedCategory)?.category || "";

    addTransaction({
      type,
      amount,
      id_category: selectedCategory,
      description: description || categoryName,
      date: new Date(),
    });
    onClose();
  }

  const filteredCategories = allCategories.filter((cat) => cat.type === (type === 1 ? "income" : "expense"));

  return (
    <div className="min-h-full bg-background p-6 flex flex-col text-primary transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Новая операция</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-primary hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Type Toggle - Сегментированный переключатель */}
        <div className="flex gap-2 p-1 bg-secondary rounded-2xl mb-8 border border-muted">
          <button
            type="button"
            onClick={() => setType(-1)}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${type === -1
              ? "bg-destructive text-destructive-foreground shadow-sm"
              : "text-muted-foreground hover:text-primary"
              }`}
          >
            Расход
          </button>
          <button
            type="button"
            onClick={() => setType(1)}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${type === 1
              ? "bg-green-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-primary"
              }`}
          >
            Доход
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-8">
          <label className="block text-sm text-muted-foreground mb-2">Сумма</label>
          <div className="relative border-b-2 border-muted focus-within:border-primary transition-colors">
            <input
              type="number"
              value={amount === 0 ? "" : amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full text-5xl font-bold bg-transparent outline-none pb-4 pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
              autoFocus
            />
            <span className="absolute right-0 bottom-6 text-2xl font-medium text-muted-foreground">
              {currency}
            </span>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-muted-foreground mb-4">Категория</label>
            <div className="flex  gap-2">
              <label className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-all active:scale-95 mb-4 hover:cursor-pointer" onClick={() => { setIsAddModalOpen(true); setIsEdit(false); }}>+ Новая</label>
              <label className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-all active:scale-95 mb-4 hover:cursor-pointer" onClick={() => { setIsEdit(true); setSelectedCategory(null); }}>Редактирование</label>

            </div>
            <AddCategoryCard isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditCategoryCard isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setIsEdit(false); }} category={allCategories.find(cat => cat.id === selectedCategory) || null} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {filteredCategories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => isEdit ? (setSelectedCategory(category.id > defaultCategories.length ? category.id : null), setIsEditModalOpen(true)) : setSelectedCategory(category.id)}
                  className={`relative p-4 rounded-2xl transition-all duration-200 border-2 ${isSelected
                      ? "bg-primary/5 border-primary shadow-[0_0_0_1px_var(--color-primary)]"
                      : "bg-secondary/50 border-transparent hover:border-muted"
                    } ${isEdit && category.id > defaultCategories.length
                      ? "ring-2 ring-gray-400 -translate-y-1 shadow-lg"
                      : ""
                    }`}
                >
                  {/* Иконка категории */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-background"
                      }`}
                  >
                    <img src={category.iconUrl} alt={category.category} className="w-6 h-6" />
                  </div>

                  {/* Название категории */}
                  <p
                    className={`text-[10px] font-medium text-center uppercase tracking-wider ${isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    {category.category}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-sm text-muted-foreground mb-2">Описание</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="На что потратили?"
            className="w-full px-5 py-4 bg-secondary rounded-2xl outline-none border border-transparent focus:border-primary transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-auto pt-4">
          <button
            type="submit"
            disabled={!amount || !selectedCategory}
            className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:scale-100 transition-all"
          >
            Подтвердить
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;