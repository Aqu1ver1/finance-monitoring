export interface NavigationProps {
    activeScreen: Screen;  
    setActiveScreen: React.Dispatch<React.SetStateAction<Screen>>;
    children?: React.ReactNode;
    category?: string;
}

export type Screen = "dashboard" | "budget" | "transactions" | "add" | "settings";