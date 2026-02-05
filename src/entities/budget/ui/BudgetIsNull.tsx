import { useTranslate } from "../../../features/swapLanguages/useTranslate";

const BudgetIsNull = ({ handleSetBudget }: { handleSetBudget: () => void }) => {
    const t = useTranslate();

    return (
        <div className="text-white">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex flex-col gap-3 p-6">
                <h2 className="text-xl">{t("budgetEmpty.title")}</h2>
                <p>{t("budgetEmpty.description")}</p>
                <button
                    className="w-full py-3 bg-white/90 hover:bg-white/80 rounded-2xl text-blue-600 font-medium transition-all active:scale-95"
                    onClick={handleSetBudget}
                >
                    {t("budgetEmpty.action")}
                </button>
            </div>
        </div>
    );
};

export default BudgetIsNull;