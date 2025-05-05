/** Captitilize first character of a string */
const capitalizeString = (string: string) => {
  const trimmedString: string = string.trim();
  return trimmedString[0].toUpperCase() + trimmedString.slice(1).toLowerCase();
};

/** Make query string readable by replacing hyphen with space  */
const convertQueryToReadable = (string: string) => {
  return string.replace('-', ' ');
};

/** Remove file extension from string */
const removeStringExtension = (string: string) => {
  return string.replace(/\.[^/.]+$/, '');
};

/** Convert MenuItem from MenuTree into relative path */
const convertMenuItemToRelativePath = (path: string) => {
  return path.substring(path.indexOf('pages') + 5);
};

/** Replace backslash with forward slash for string */
const replaceBackSlashWithForwardSlash = (string: string) => {
  return string.replace(/\\/g, '/');
};

export {
  capitalizeString,
  convertQueryToReadable,
  removeStringExtension,
  convertMenuItemToRelativePath,
  replaceBackSlashWithForwardSlash,
};
