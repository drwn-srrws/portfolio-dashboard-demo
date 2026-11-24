const convertToAndFromBpsToPricePerShareUpside = (
  isConvertingBpsToSharePrice: boolean,
  value?: string | number,
  pricePerShare?: number
): number => {
  if (!value || !pricePerShare) return 0;

  const v = typeof value === "string" ? parseFloat(value) : value;

  return isConvertingBpsToSharePrice
    ? pricePerShare * (1 + v / 100)
    : ((v - pricePerShare) / pricePerShare) * 100;
};

const convertToAndFromBpsToPricePerShareDownside = (
  isConvertingBpsToSharePrice: boolean,
  value?: string | number,
  pricePerShare?: number
): number => {
  if (!value || !pricePerShare) return 0;

  const v = typeof value === "string" ? parseFloat(value) : value;

  return isConvertingBpsToSharePrice
    ? pricePerShare * (1 - v / 100)
    : ((pricePerShare - v) / pricePerShare) * 100;
};

export const convertBpsToPricePerShareUpside = (
  percentage?: string | number,
  pricePerShare?: number
): number =>
  Math.round(
    convertToAndFromBpsToPricePerShareUpside(true, percentage, pricePerShare) *
      100
  ) / 100;

export const convertPricePerShareToBpsUpside = (
  price?: string | number,
  pricePerShare?: number
): number =>
  convertToAndFromBpsToPricePerShareUpside(false, price, pricePerShare);

export const convertBpsToPricePerShareDownside = (
  percentage?: string | number,
  pricePerShare?: number
): number =>
  Math.round(
    convertToAndFromBpsToPricePerShareDownside(
      true,
      percentage,
      pricePerShare
    ) * 100
  ) / 100;

export const convertPricePerShareToBpsDownside = (
  price?: string | number,
  pricePerShare?: number
): number =>
  convertToAndFromBpsToPricePerShareDownside(false, price, pricePerShare);
