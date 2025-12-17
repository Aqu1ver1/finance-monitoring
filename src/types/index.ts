export type Screen = "dashboard" | "budget" | "transactions" | "add" | "settings";

export interface NavigationProps {
    activeScreen: Screen;  
    setActiveScreen: React.Dispatch<React.SetStateAction<Screen>>;
    children?: React.ReactNode;
    text?: string;
    category?: string;
}
