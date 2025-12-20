import { useState } from "react";
import {
  User,
  Bell,
  Moon,
  Lock,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import CurrencyExchange from "../features/settings/currency/ui/CurrencyExchange";
import { useThemeContext } from "../shared/context/ThemeContext";

const Settings = () => {
  const { isDark, toggle } = useThemeContext();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-background p-6 pb-12 text-primary transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Настройки</h2>

        {/* Profile Card - Используем градиент, который хорошо смотрится в обеих темах */}
        <div className="bg-linear-to-br from-indigo-600 to-blue-700 text-white rounded-4xl p-6 shadow-lg shadow-blue-500/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xl font-semibold">Иван Петров</p>
              <p className="text-blue-100 text-sm opacity-80 font-light">ivan.petrov@email.com</p>
            </div>
          </div>
          <button className="mt-5 w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium backdrop-blur-sm border border-white/10 transition-all active:scale-95">
            Редактировать профиль
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* General Settings */}
        <section>
          <h4 className="px-2 mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Общие</h4>
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
                <p className="font-medium">Темная тема</p>
                <p className="text-xs text-muted-foreground italic">
                  {isDark ? "Экономит заряд батареи" : "Классический вид"}
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

            {/* Notifications Toggle */}
            <button
              onClick={() => setNotifications(!notifications)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Уведомления</p>
                <p className="text-xs text-muted-foreground">{notifications ? "Активны" : "Приглушены"}</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${notifications ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${notifications ? "translate-x-6" : "translate-x-0"}`} />
              </div>
            </button>
          </div>
        </section>

        {/* Security & Support */}
        <section>
          <h4 className="px-2 mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Система</h4>
          <div className="bg-secondary rounded-3xl border border-muted overflow-hidden">
            <MenuButton icon={<Lock className="w-5 h-5 text-purple-500" />} title="Безопасность" sub="Пароль и FaceID" color="bg-purple-500/10" />
            <div className="h-px bg-border/50 mx-4"></div>
            <MenuButton icon={<CreditCard className="w-5 h-5 text-blue-500" />} title="Счета" sub="2 карты привязаны" color="bg-blue-500/10" />
            <div className="h-px bg-border/50 mx-4"></div>
            <MenuButton icon={<HelpCircle className="w-5 h-5 text-emerald-500" />} title="Поддержка" sub="Чат 24/7" color="bg-emerald-500/10" />
          </div>
        </section>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 p-5 bg-destructive/10 text-destructive rounded-3xl font-bold hover:bg-destructive/20 transition-all active:scale-[0.98]">
          <LogOut className="w-5 h-5" />
          <span>Выйти из аккаунта</span>
        </button>

        <div className="text-center text-xs text-muted-foreground opacity-50 pb-4">
          <p>Finance App • v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

// Вспомогательный компонент для строк меню
const MenuButton = ({ icon, title, sub, color }: any) => (
  <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
    <div className="flex-1 text-left">
      <p className="font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
  </button>
);
export default Settings;