export const consoleMessage = (text: string) => {
  console.log(' ');
  console.log(
    '======================================================================================',
  );
  console.log(
    '|                                                                                    |',
  );
  console.log('|  ' + text + generateSpaces(82 - text.length) + '|');
  console.log(
    '|                                                                                    |',
  );
  console.log(
    '======================================================================================',
  );
  console.log(' ');
};

const generateSpaces = (size: number) => {
  if (typeof size !== 'number' || size < 0) {
    throw new Error(
      'Invalid size argument. Please provide a non-negative number.',
    );
  }

  return ' '.repeat(size);
};
