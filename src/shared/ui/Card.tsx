// shared/ui/Card/Card.tsx
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <div 
            className={
                "flex items-center gap-3 px-4 py-3 bg-secondary rounded-2xl border border-muted" + 
                (className ? ` ${className}` : "")
            }
            {...props}
        >
            {children}
        </div>
    );
};