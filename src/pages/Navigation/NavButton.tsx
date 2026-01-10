import React from 'react'
import type { NavigationProps, Screen } from './navigationConfig';

const NavButton: React.FC<NavigationProps> = ({ activeScreen, setActiveScreen, children, category }) => {
    const isActive = activeScreen === category;

    return (
        <button
            onClick={() => setActiveScreen(category as Screen)}
            className={`h-full w-full flex items-center justify-center transition-all duration-300 relative ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            }`}
        >
            {/* Иконка */}
            <div className={`relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
                {/* Клонируем иконку (children), чтобы управлять её размером и цветом */}
                {React.cloneElement(children as React.ReactElement, {
                    size: "32",
                    strokeWidth: isActive ? 2.5 : 2,
                    className: "transition-all"
                } as any)}
            </div>
        </button>
    );
};

export default NavButton;