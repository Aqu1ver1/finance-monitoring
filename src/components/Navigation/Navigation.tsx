import { Home, List, Plus, Wallet, SettingsIcon} from 'lucide-react'
import React from 'react'
import type { Screen } from '../../types';
import type { NavigationProps } from '../../types';
import NavButton from './NavButton';

const Navigation: React.FC<NavigationProps> = ({ activeScreen, setActiveScreen }) => {
    
    return (
        <div className="h-20 bg-white border-t border-border flex items-center justify-around px-4 pb-2">
            <NavButton activeScreen={activeScreen} setActiveScreen={setActiveScreen} text="Главная" category='dashboard'>
              <Home className="w-6 h-6" />
            </NavButton>
            <NavButton activeScreen={activeScreen} setActiveScreen={setActiveScreen} text="Бюджет" category='budget'>
              <Wallet className="w-6 h-6" />
            </NavButton>
            <button
              onClick={() => setActiveScreen("add")}
              className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full -mt-6 shadow-lg"
            >
              <Plus className="w-7 h-7" />
            </button>
            <NavButton activeScreen={activeScreen} setActiveScreen={setActiveScreen} text="Транзакции" category='transactions'>
              <List className="w-6 h-6" />
            </NavButton>
            <NavButton activeScreen={activeScreen} setActiveScreen={setActiveScreen} text="Настройки" category='settings'>
              <SettingsIcon className="w-6 h-6" />
            </NavButton>
          </div>
    )
}

export default Navigation