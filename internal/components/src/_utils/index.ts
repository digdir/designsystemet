export const capitalizeString = (string: string) => {
  const trimmedString: string = string.trim();
  return trimmedString[0].toUpperCase() + trimmedString.slice(1).toLowerCase();
};
