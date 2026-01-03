// widgets/StatCard/ui/StatCard.tsx
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    amount: number;
    currency: string;
    type: "income" | "expense";
}

const StatCard = ({ 
    icon: Icon, 
    label, 
    amount, 
    currency, 
    type: type
}: StatCardProps) => {
    const colors = {
        income: {
            bg: "bg-green-500/10",
            text: "text-green-500"
        },
        expense: {
            bg: "bg-red-500/10",
            text: "text-red-500"
        }
    };

    const color = colors[type];

    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-2xl border border-muted">
            <div className={`p-2 ${color.bg} rounded-full`}>
                <Icon className={`w-5 h-5 ${color.text}`} />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-semibold text-primary">
                    {amount.toLocaleString("ru-RU")} {currency}
                </p>
            </div>
        </div>
    );
};
export default StatCard;