export const formatDateToText = (date: Date | null): string => {
  if (!date) return '';
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const day = dateObj.getDate();
  const month = dateObj.getMonth()+1;
  return `${day}.${month}`;
};
