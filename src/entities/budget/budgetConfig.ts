// entities/budget/model/types.ts

export interface BudgetScheme {
    id: string; // 'standard' | 'gentle' | 'accumulative'
    name: string;
    needs: number;
    wants: number;
    savings: number;
}

export interface Budget {
    id: number;
    amount: number;
    schemeId: BudgetScheme["id"];
    dateCreate: Date;
    dateUpdate: Date;
    isActive: boolean; // было number, должно быть boolean
}

// Константы схем
export const BUDGET_SCHEMES: Record<string, BudgetScheme> = {
    standard: {
        id: 'standard',
        name: '50 / 30 / 20',
        needs: 50,
        wants: 30,
        savings: 20
    },
    gentle: {
        id: 'gentle',
        name: '60 / 30 / 10',
        needs: 60,
        wants: 30,
        savings: 10
    },
    accumulative: {
        id: 'accumulative',
        name: '40 / 30 / 30',
        needs: 40,
        wants: 30,
        savings: 30
    }
} as const;

export type BudgetSchemeId = keyof typeof BUDGET_SCHEMES;