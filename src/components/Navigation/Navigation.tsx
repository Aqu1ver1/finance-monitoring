import { Home, List, Plus, Wallet, SettingsIcon } from 'lucide-react'
import React from 'react'
import type { Screen } from '../../shared/types';
import type { NavigationProps } from '../../shared/types';
import NavButton from './NavButton';

const Navigation: React.FC<NavigationProps> = ({ activeScreen, setActiveScreen }) => {
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50">
            {/* Контейнер с размытием */}
            <div className="bg-background/80 backdrop-blur-xl border-t border-muted px-4 pb-safe pt-2 h-20 flex items-center justify-around relative">
                
                <NavButton activeScreen={activeScreen} setActiveScreen={setActiveScreen} text="Главная" category='dashboard'>
                    <Home />
                </NavButton>

                <NavButton activeScreen={activeScreen} setActiveScreen={setActiveScreen} text="Бюджет" category='budget'>
                    <Wallet />
                </NavButton>

                {/* Полностью круглая кнопка без бордера */}
                <div className="relative -mt-12">
                    <button
                        onClick={() => setActiveScreen("add" as Screen)}
                        className="flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-xl shadow-primary/40 active:scale-90 transition-all duration-200"
                    >
                        <Plus className="w-9 h-9" strokeWidth={2.5} />
                    </button>
                </div>

                <NavButton activeScreen={activeScreen} setActiveScreen={setActiveScreen} text="Операции" category='transactions'>
                    <List />
                </NavButton>

                <NavButton activeScreen={activeScreen} setActiveScreen={setActiveScreen} text="Настройки" category='settings'>
                    <SettingsIcon />
                </NavButton>
            </div>
        </nav>
    )
}
export default Navigation