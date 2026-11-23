/** Lets the user save `content` as a file named `filename`. */
export const downloadFile = (
  filename: string,
  content: string,
  type: string,
) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
