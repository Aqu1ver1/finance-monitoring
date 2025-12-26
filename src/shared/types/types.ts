export type Screen = "dashboard" | "budget" | "transactions" | "add" | "settings";

export interface NavigationProps {
    activeScreen: Screen;  
    setActiveScreen: React.Dispatch<React.SetStateAction<Screen>>;
    children?: React.ReactNode;
    text?: string;
    category?: string;
}

import type { LucideIcon } from "lucide-react";
export interface Category {
  id: string;
  category: string;
  icon: LucideIcon;
  color: string;
}