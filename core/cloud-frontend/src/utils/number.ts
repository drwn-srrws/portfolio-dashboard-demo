export const formatNumber = (value: number, digits: number = 2): string => {
  if (isNaN(value)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};
