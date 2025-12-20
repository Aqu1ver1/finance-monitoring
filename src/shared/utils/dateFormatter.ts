const monthsRu = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

export const formatDateToText = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const day = dateObj.getDate();
  const month = monthsRu[dateObj.getMonth()];
  return `${day} ${month}`;
};
