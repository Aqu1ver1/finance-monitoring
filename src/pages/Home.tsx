import Navigation from "../components/Navigation";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ShoppingCart, Home as HomeIcon, Car, Coffee, Sparkles, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardProps {
  onAddClick: () => void;
}

const expenseData = [
  { name: "Еда", value: 15000, color: "#3B82F6" },
  { name: "Транспорт", value: 8000, color: "#10B981" },
  { name: "Жильё", value: 25000, color: "#F59E0B" },
  { name: "Развлечения", value: 7000, color: "#8B5CF6" },
  { name: "Прочее", value: 5000, color: "#EC4899" },
];

const recentTransactions = [
  { id: 1, name: "Продукты", category: "Еда", amount: -1250, icon: ShoppingCart, color: "#3B82F6" },
  { id: 2, name: "Зарплата", category: "Доход", amount: 75000, icon: TrendingUp, color: "#10B981" },
  { id: 3, name: "Такси", category: "Транспорт", amount: -350, icon: Car, color: "#10B981" },
  { id: 4, name: "Кафе", category: "Еда", amount: -890, icon: Coffee, color: "#3B82F6" },
  { id: 5, name: "Аренда", category: "Жильё", amount: -25000, icon: HomeIcon, color: "#F59E0B" },
];

const HomePage: React.FC<DashboardProps> = ({ onAddClick }) => {
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);
    const balance = 135000;
    const income = 75000;
    const expenses = 60000;
    return (
            <div className=" bg-white rounded-[40px] overflow-hidden flex flex-col relative text-black w-full max-w-md">
                <div className="mb-8 ">
                    <p className=" mb-1">Общий баланс</p>
                    <h1 className="text-5xl mb-4">{balance.toLocaleString("ru-RU")} ₽</h1>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <div>
                                <p className="text-xs text-green-700">Доход</p>
                                <p className="text-green-900">{income.toLocaleString("ru-RU")} ₽</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                            <TrendingDown className="w-4 h-4 text-red-600" />
                            <div>
                                <p className="text-xs text-red-700">Расход</p>
                                <p className="text-red-900">{expenses.toLocaleString("ru-RU")} ₽</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Expense Chart */}
                <div className="mb-8">
                    <h3 className="mb-4">Расходы по категориям</h3>
                    <div className="bg-muted/30 rounded-2xl p-6">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {expenseData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                    <div className="flex-1">
                                        <p className="text-sm">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.value.toLocaleString("ru-RU")} ₽
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3>Последние операции</h3>
                        <button className="text-sm text-primary">Все</button>
                    </div>
                    <div className="space-y-3">
                        {recentTransactions.map((transaction) => {
                            const Icon = transaction.icon;
                            return (
                                <div
                                    key={transaction.id}
                                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl"
                                >
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${transaction.color}15` }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: transaction.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <p>{transaction.name}</p>
                                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                                    </div>
                                    <p
                                        className={transaction.amount > 0 ? "text-green-600" : "text-foreground"}
                                    >
                                        {transaction.amount > 0 ? "+" : ""}
                                        {transaction.amount.toLocaleString("ru-RU")} ₽
                                    </p>
                                </div>
                            );
                        })}
                        <Navigation />
                    </div>
                </div>
            </div>
    );
}


export default HomePage;