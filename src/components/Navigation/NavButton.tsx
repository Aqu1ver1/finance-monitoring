import React from 'react'
import type { NavigationProps } from '../../shared/types';
import type { Screen } from '../../shared/types';

const NavButton: React.FC<NavigationProps> = ({ activeScreen, setActiveScreen, children, text, category }) => {
    return (
        <button
            onClick={() => setActiveScreen(category as Screen)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                activeScreen === category ? "text-primary" : "text-muted-foreground"
            }`}
        >
            {children}
            <span className="text-xs">{text}</span>
        </button>
    );
};

export default NavButton;