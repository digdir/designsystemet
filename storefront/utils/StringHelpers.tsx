const capitalizeString = (string: string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

const convertQueryToReadable = (string: string) => {
  return string.replace('-', ' ');
};

const removeStringExtension = (string: string) => {
  return string.replace(/\.[^/.]+$/, '');
};

const convertMenuItemToRelativePath = (path: string) => {
  return path.substring(path.indexOf('pages') + 5);
};

export {
  capitalizeString,
  convertQueryToReadable,
  removeStringExtension,
  convertMenuItemToRelativePath,
};
