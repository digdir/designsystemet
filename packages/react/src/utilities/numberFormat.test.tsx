import { render as renderRtl, screen } from '@testing-library/react';
import type {
  NumericFormatProps,
  PatternFormatProps,
} from 'react-number-format';

import { formatNumericText } from './numberFormat';

describe('numberFormat', () => {
  it('should render as NumericFormat if format is of type NumericFormatProps', () => {
    render({
      text: '12345.6789',
      format: {
        prefix: 'NOK ',
        thousandSeparator: ' ',
        decimalSeparator: ',',
        decimalScale: 2,
      },
    });

    expect(screen.getByText('NOK 12 345,67')).toBeInTheDocument();
  });

  it('should render as PatternFormat if format is of type PatternFormatProps', () => {
    render({
      text: '98765432',
      format: {
        format: '+47 ### ## ###',
      },
    });

    expect(screen.getByText('+47 987 65 432')).toBeInTheDocument();
  });

  it('should render as plain text if format is undefined', () => {
    render({
      text: '12345.6789',
    });

    expect(screen.getByText('12345.6789')).toBeInTheDocument();
  });
});

interface FormatNumericTextProps {
  text: string;
  format?: NumericFormatProps | PatternFormatProps;
}

const render = (props: FormatNumericTextProps) => {
  return renderRtl(<span>{formatNumericText(props.text, props.format)}</span>);
};
