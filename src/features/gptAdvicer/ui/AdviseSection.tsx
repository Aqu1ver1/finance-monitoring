import { useEffect, useMemo, useRef, useState } from 'react'
import { getGptAdvice, type AdviceFocus } from "../model/gptAdvice";
import { Button } from '../../../shared/ui/Button';
import { useCurrencyStore } from '../../currency/currency.store';
import { useTransactionsStore } from '../../../entities/transactions/transactions.store';
import { useCustomCategoriesStore } from '../../customCategories/customCategories.store';
import { useLanguageStore } from '../../swapLanguages/language.store';
import { useTranslate } from '../../swapLanguages/useTranslate';
import { defaultCategories } from '../../../shared/config/defaultCategories';
import { useAdviceOptions } from '../model/adviceOptions';
import { useTransactionsForAdvice } from '../model/transactionForAdvice';

type AdviseSectionProps = {
    totalIncome: number;
    totalExpense: number;
}

const AdviseSection = ({totalIncome, totalExpense}: AdviseSectionProps) => {
     const [adviceFocus, setAdviceFocus] = useState<AdviceFocus>("overview");
     const [adviceGoal, setAdviceGoal] = useState("");
     const [adviceText, setAdviceText] = useState("");
     const [adviceError, setAdviceError] = useState<string | null>(null);
     const [isAdviceLoading, setIsAdviceLoading] = useState(false);
     const currency = useCurrencyStore(state => state.selectedCurrency);
     const transactions = useTransactionsStore(state => state.transactions);
     const customCategories = useCustomCategoriesStore(state => state.categories);
     const lang = useLanguageStore(state => state.lang);
     const t = useTranslate();
     const allCategories = useMemo(
       () => [...defaultCategories, ...customCategories],
       [customCategories]
     );
    const adviceOptions = useAdviceOptions();
    const transactionsForAdviceData = useTransactionsForAdvice({ allCategories, transactions, t, currency });
    const requestControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
      return () => {
        requestControllerRef.current?.abort();
      };
    }, []);

    const handleGetAdvice = async () => {
    setAdviceError(null);
    setAdviceText("");

    if (!adviceGoal.trim()) {
      setAdviceError(t("transactions.gpt.emptyError"));
      return;
    }

    if (transactions.length === 0) {
      setAdviceError(t("transactions.gpt.noTransactions"));
      return;
    }

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setAdviceError(t("transactions.gpt.apiMissing"));
      return;
    }

    requestControllerRef.current?.abort();
    const requestController = new AbortController();
    requestControllerRef.current = requestController;
    setIsAdviceLoading(true);
    try {
      const response = await getGptAdvice({
        focus: adviceFocus,
        goal: adviceGoal.trim(),
        currency,
        language: lang,
        totals: {
          income: totalIncome,
          expense: totalExpense,
          net: totalIncome - totalExpense
        },
        transactions: transactionsForAdviceData
      }, { signal: requestController.signal });
      if (requestController.signal.aborted) return;
      setAdviceText(response);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setAdviceError(t("transactions.gpt.error"));
    } finally {
      if (requestControllerRef.current === requestController) {
        setIsAdviceLoading(false);
      }
    }
  };
    return (
        <div className="mb-8 rounded-2xl border border-muted bg-secondary/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">{t("transactions.gpt.title")}</h3>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[220px,1fr,auto]">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">
                {t("transactions.gpt.typeLabel")}
              </label>
              <select
                className="rounded-lg border border-muted bg-background px-3 py-2 text-sm text-primary"
                value={adviceFocus}
                onChange={(event) => setAdviceFocus(event.target.value as AdviceFocus)}
              >
                {adviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">
                {t("transactions.gpt.goalLabel")}
              </label>
              <textarea
                rows={2}
                value={adviceGoal}
                onChange={(event) => setAdviceGoal(event.target.value)}
                placeholder={t("transactions.gpt.goalPlaceholder")}
                className="min-h-11 rounded-lg border border-muted bg-background px-3 py-2 text-sm text-primary"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGetAdvice}
                loading={isAdviceLoading}
              >
                {isAdviceLoading
                  ? t("transactions.gpt.loading")
                  : t("transactions.gpt.cta")}
              </Button>
            </div>
          </div>

          {adviceError && (
            <p className="mt-3 text-sm text-red-600">{adviceError}</p>
          )}

          {adviceText && (
            <div className="mt-4 rounded-xl border border-muted bg-background/70 p-4">
              <p className="text-sm font-semibold mb-2">
                {t("transactions.gpt.resultTitle")}
              </p>
              <div className="whitespace-pre-line text-sm text-primary">
                {adviceText}
              </div>
            </div>
          )}
        </div>
  )
}
export default AdviseSection;