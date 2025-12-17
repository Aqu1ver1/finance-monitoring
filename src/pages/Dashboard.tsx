import Navigation from "../components/Navigation";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ShoppingCart, Home as HomeIcon, Car, Coffee, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import RecentTransactions from "../components/RecentTransactions";

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


const Dashboard: React.FC<DashboardProps> = ({ onAddClick }) => {
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);
    const balance = 135000;
    const income = 75000;
    const expenses = 60000;
    return (
            <div className=" bg-white overflow-hidden flex flex-col relative text-black  p-6">
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
                <RecentTransactions />
            </div>
    );
}


export default Dashboard;