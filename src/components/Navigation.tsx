import { Home, List, Plus, Wallet } from 'lucide-react'
import React from 'react'

interface NavigationProps {
    activeScreen: Screen;  
    setActiveScreen: React.Dispatch<React.SetStateAction<Screen>>;
}

type Screen = "dashboard" | "budget" | "transactions" | "add";
const Navigation: React.FC<NavigationProps> = ({ activeScreen, setActiveScreen }) => {
    
    return (
        <div className="h-20 bg-white border-t border-border flex items-center justify-around px-4 pb-2">
            <button
              onClick={() => setActiveScreen("dashboard")}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                activeScreen === "dashboard" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Главная</span>
            </button>
            <button
              onClick={() => setActiveScreen("budget")}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                activeScreen === "budget" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Wallet className="w-6 h-6" />
              <span className="text-xs">Бюджет</span>
            </button>
            <button
              onClick={() => setActiveScreen("add")}
              className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full -mt-6 shadow-lg"
            >
              <Plus className="w-7 h-7" />
            </button>
            <button
              onClick={() => setActiveScreen("transactions")}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                activeScreen === "transactions" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <List className="w-6 h-6" />
              <span className="text-xs">История</span>
            </button>
          </div>
    )
}

export default Navigation