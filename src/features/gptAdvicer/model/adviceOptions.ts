import   { useMemo } from 'react'
import { useTranslate } from '../../swapLanguages/useTranslate'

export const useAdviceOptions = () => {
    const t = useTranslate();
    return useMemo(() => [
        { value: "overview" as const, label: t("transactions.gpt.typeOverview") },
        { value: "savings" as const, label: t("transactions.gpt.typeSavings") },
        { value: "cuts" as const, label: t("transactions.gpt.typeCuts") },
        { value: "budget" as const, label: t("transactions.gpt.typeBudget") }
    ], [t]);
};
