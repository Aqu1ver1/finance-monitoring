import { BUDGET_SCHEMES, type BudgetSchemeId } from "./budgetConfig";

export interface BudgetDistribution {
    needs: number;
    wants: number;
    savings: number;
}

export const calculateBudgetDistribution = (
    amount: number,
    schemeId: BudgetSchemeId
): BudgetDistribution => {
    const scheme = BUDGET_SCHEMES[schemeId];
    
    return {
        needs: (amount * scheme.needs) / 100,
        wants: (amount * scheme.wants) / 100,
        savings: (amount * scheme.savings) / 100
    };
};