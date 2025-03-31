export const formatNumberWithCommas = (num: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  });
};