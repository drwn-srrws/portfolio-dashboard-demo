export const numToDollar = (value: number | string): string => {
  if (
    value === null ||
    value === undefined ||
    isNaN(parseFloat(value as string))
  )
    return "";

  if (typeof value === "string") value = parseFloat(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const thousands = 3;
export const millions = 6;
export const billions = 9;

export const dollarsToUnit = (value: number, digitsToReplace: number) => {
  const b = value / 10 ** digitsToReplace;
  return b;
};
