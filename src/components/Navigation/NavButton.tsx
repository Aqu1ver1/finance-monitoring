import React from 'react'
import type { NavigationProps } from '../../shared/types';
import type { Screen } from '../../shared/types';

const NavButton: React.FC<NavigationProps> = ({ activeScreen, setActiveScreen, children, text, category }) => {
    const isActive = activeScreen === category;

    return (
        <button
            onClick={() => setActiveScreen(category as Screen)}
            className={`group flex flex-col items-center gap-1.5 py-1 px-2 flex-1 transition-all duration-300 relative ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            }`}
        >
            {/* Иконка */}
            <div className={`relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
                {/* Клонируем иконку (children), чтобы управлять её размером и цветом */}
                {React.cloneElement(children as React.ReactElement, {
                    size: "24",
                    strokeWidth: isActive ? 2.5 : 2,
                    className: "transition-all"
                } as any)}
            </div>

            {/* Текст подписи */}
            <span className={`text-[10px] font-medium transition-opacity duration-300 ${
                isActive ? "opacity-100" : "opacity-70"
            }`}>
                {text}
            </span>

            {/* Индикатор активного состояния (необязательно, но красиво) */}
            {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
            )}
            
            {/* Эффект при нажатии на мобильных устройствах */}
            <div className="absolute inset-0 bg-primary/5 rounded-2xl scale-75 opacity-0 group-active:opacity-100 group-active:scale-100 transition-all" />
        </button>
    );
};

export default NavButton;