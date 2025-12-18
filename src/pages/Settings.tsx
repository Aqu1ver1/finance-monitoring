import { useState } from "react";
import {
  User,
  Bell,
  Globe,
  Moon,
  Lock,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Currency,
} from "lucide-react";
import CurrencyExchange from "../features/settings/currency/ui/CurrencyExchange";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-6 pb-8 text-primary">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-6">Настройки</h2>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xl">Иван Петров</p>
              <p className="">ivan.petrov@email.com</p>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-white/20 rounded-lg text-sm backdrop-blur-sm">
            Редактировать профиль
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div>
          <h4 className="mb-3 text-muted-foreground">Общие</h4>
          <div className="bg-muted/30 rounded-2xl overflow-hidden">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p>Темная тема</p>
                <p className="text-sm text-muted-foreground">
                  {darkMode ? "Включена" : "Выключена"}
                </p>
              </div>
              <div
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  darkMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                ></div>
              </div>
            </button>

            <div className="h-px bg-border mx-4"></div>

            {/* Currency */}
            <CurrencyExchange />

            <div className="h-px bg-border mx-4"></div>

            {/* Notifications */}
            <button
              onClick={() => setNotifications(!notifications)}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1 text-left">
                <p>Уведомления</p>
                <p className="text-sm text-muted-foreground">
                  {notifications ? "Включены" : "Выключены"}
                </p>
              </div>
              <div
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  notifications ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Security */}
        <div>
          <h4 className="mb-3 text-muted-foreground">Безопасность</h4>
          <div className="bg-muted/30 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p>Изменить пароль</p>
                <p className="text-sm text-muted-foreground">Последнее изменение 30 дн. назад</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="h-px bg-border mx-4"></div>

            <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p>Связанные счета</p>
                <p className="text-sm text-muted-foreground">2 счета</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-3 text-muted-foreground">Поддержка</h4>
          <div className="bg-muted/30 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <p>Помощь и FAQ</p>
                <p className="text-sm text-muted-foreground">Часто задаваемые вопросы</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Выйти из аккаунта</span>
        </button>

        {/* App Version */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Версия приложения 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
export default Settings;