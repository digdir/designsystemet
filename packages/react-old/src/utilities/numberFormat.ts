import type {
  NumericFormatProps,
  PatternFormatProps,
} from 'react-number-format';
import { numericFormatter, patternFormatter } from 'react-number-format';

export const isPatternFormat = (
  numberFormat: NumericFormatProps | PatternFormatProps,
): numberFormat is PatternFormatProps => {
  return (numberFormat as PatternFormatProps).format !== undefined;
};

export const isNumericFormat = (
  numberFormat: NumericFormatProps | PatternFormatProps,
): numberFormat is NumericFormatProps => {
  return (numberFormat as PatternFormatProps).format === undefined;
};

export const formatNumericText = (
  text: string,
  format?: NumericFormatProps | PatternFormatProps,
) => {
  if (format && isNumericFormat(format)) {
    return numericFormatter(text, format);
  } else if (format && isPatternFormat(format)) {
    return patternFormatter(text, format);
  } else {
    return text;
  }
};
