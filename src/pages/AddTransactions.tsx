import { useState } from "react";
import { X, ShoppingCart, Car, Home as HomeIcon, Coffee, Sparkles, TrendingUp } from "lucide-react";
import { useCurrencyStore } from "../features/settings/currency/model/currency.store";

interface AddTransactionProps {
  onClose: () => void;
}

const categories = [
  { id: "food", name: "Еда", icon: ShoppingCart, color: "#3B82F6" },
  { id: "transport", name: "Транспорт", icon: Car, color: "#10B981" },
  { id: "home", name: "Жильё", icon: HomeIcon, color: "#F59E0B" },
  { id: "entertainment", name: "Развлечения", icon: Coffee, color: "#8B5CF6" },
  { id: "other", name: "Прочее", icon: Sparkles, color: "#EC4899" },
  { id: "income", name: "Доход", icon: TrendingUp, color: "#10B981" },
];

const AddTransaction: React.FC<AddTransactionProps> = ({ onClose }) => {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const currency = useCurrencyStore(state => state.selectedCurrency);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onClose();
  };

  const filteredCategories = categories.filter((cat) =>
    type === "income" ? cat.id === "income" : cat.id !== "income"
  );

  return (
    <div className="min-h-full bg-background p-6 flex flex-col text-primary">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2>Новая операция</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/30"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Type Toggle */}
        <div className="flex gap-3 mb-8">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              type === "expense"
                ? "bg-red-500 text-white"
                : "bg-muted/30 text-muted-foreground"
            }`}
          >
            Расход
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              type === "income"
                ? "bg-green-500 text-white"
                : "bg-muted/30 text-muted-foreground"
            }`}
          >
            Доход
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-8">
          <label className="block text-muted-foreground mb-2">Сумма</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="0"
              className="w-full text-4xl bg-transparent border-b-2 border-border focus:border-primary outline-none pb-2"
              required
            />
            <span className="absolute right-0 bottom-2 text-2xl text-muted-foreground">{currency}</span>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <label className="block mb-3">Категория</label>
          <div className="grid grid-cols-3 gap-3">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl transition-all ${
                    isSelected
                      ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                      : "bg-muted/30"
                  }`}
                >
                  <Icon
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: isSelected ? "currentColor" : category.color }}
                  />
                  <p className="text-xs text-center">{category.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block mb-2">Описание</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Например: Продукты в магазине"
            className="w-full px-4 py-3 bg-muted/30 rounded-xl outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-auto">
          <button
            type="submit"
            disabled={!amount || !selectedCategory}
            onClick={(handleSubmit)}
            className="w-full py-4 bg-primary text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Добавить операцию
          </button>
        </div>
      </form>
    </div>
  );
}
export default AddTransaction;