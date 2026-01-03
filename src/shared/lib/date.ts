export const getMonthEndDate = (date: Date): Date => {
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return endDate;
};

export const getMonthStartDate = (date: Date): Date => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return startDate;
};