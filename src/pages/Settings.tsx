// import { useState } from "react";
import {
  Moon,
  LogOut,
} from "lucide-react";
import CurrencyExchange from "../features/currency/ui/CurrencyExchange";
import { useThemeContext } from "../app/provides/ThemeProvides";
import { useBudgetStore } from "../entities/budget/budget.store";
import { useTransactionsStore } from "../entities/transactions/transactions.store";
import { useTranslate } from "../features/swapLanguages/useTranslate";
import LanguageSwitcher from "../features/swapLanguages/ui/LanguageSwitcher";

// Вспомогательный компонент для строк меню
// const MenuButton = ({ icon, title, sub, color }: any) => (
//   <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
//     <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
//       {icon}
//     </div>
//     <div className="flex-1 text-left">
//       <p className="font-medium">{title}</p>
//       <p className="text-xs text-muted-foreground">{sub}</p>
//     </div>
//     <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
//   </button>
// );

const Settings = () => {
  const { isDark, toggle } = useThemeContext();
  const resetBudgetData = () => {
    useBudgetStore.getState().resetBudgetData();
  }
  const removeAllTransactions = () => {
    useTransactionsStore.getState().removeAllTransactions();
  }
  const t = useTranslate();
  return (
    <div className="min-h-screen bg-background p-6 pb-12 text-primary transition-colors duration-300">
      {/* Settings Sections */}
      <div className="space-y-8">
        {/* General Settings */}
        <section>
          <h4 className="px-2 mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("SettingGroups.settingsPage")}</h4>
          <div className="bg-secondary rounded-3xl border border-muted overflow-hidden">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{t("settingsBTN.Darktheme")}</p>
                <p className="text-xs text-muted-foreground italic">
                  {isDark ? t("settingsBTN.EconomizesBattery") : t("settingsBTN.ClassicView")}
                </p>
              </div>
              {/* Custom Toggle Switch */}
              <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isDark ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isDark ? "translate-x-6" : "translate-x-0"}`} />
              </div>
            </button>
            <div className="h-px bg-border/50 mx-4"></div>
            <CurrencyExchange />
            <div className="h-px bg-border/50 mx-4"></div>
            {/* Language Selection */}
            <LanguageSwitcher />
            {/* Reaet Budget Data */}
            <div className="h-px bg-border/50 mx-4"></div>
            <button
              className="w-full flex items-center gap-2 p-5  text-destructive rounded-3xl font-bold hover:bg-destructive/20 transition-all active:scale-[0.98]"
              onClick={resetBudgetData}
            >
              <LogOut className="w-5 h-5" />
              <span>{t("settingsBTN.Removebudget")}</span>
            </button>
            <div className="h-px bg-border/50 mx-4"></div>
            {/* Remove All Transactions */}
            <button
              className="w-full flex items-center gap-2 p-5  text-destructive rounded-3xl font-bold hover:bg-destructive/20 transition-all active:scale-[0.98]"
              onClick={removeAllTransactions}
            >
              <LogOut className="w-5 h-5" />
              <span>{t("settingsBTN.RemoveTransactions")}</span>
            </button>
          </div>
        </section>
        <div className="text-center text-xs text-muted-foreground opacity-50 pb-4">
          <p>{t("footer.version")}</p>
        </div>
      </div >
    </div >
  );
};


export default Settings;