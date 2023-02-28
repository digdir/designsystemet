const capitalizeString = (string: string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

const convertQueryToReadable = (string: string) => {
  return string.replace('-', ' ');
};

export { capitalizeString, convertQueryToReadable };
