import { forwardRef, useContext, useEffect } from 'react';

import { Heading, type HeadingProps } from '../Typography/Heading';

import {
  ErrorSummaryContext,
  type ErrorSummaryProps,
} from './ErrorSummaryRoot';

export type ErrorSummaryHeadingProps = Omit<HeadingProps, 'ref'>;

const HEADING_SIZE_MAP: {
  [key in NonNullable<ErrorSummaryProps['size']>]: HeadingProps['size'];
} = {
  sm: '2xs',
  md: 'xs',
  lg: 'sm',
} as const;

export const ErrorSummaryHeading = forwardRef<
  HTMLHeadingElement,
  ErrorSummaryHeadingProps
>(function ErrorSummaryHeading(
  { className, id, ...rest }: ErrorSummaryHeadingProps,
  ref,
) {
  const { size, headingId, setHeadingId } = useContext(ErrorSummaryContext);

  useEffect(() => {
    if (id && headingId !== id) setHeadingId(id);
  }, [headingId, id, setHeadingId]);

  return (
    <Heading
      className='ds-error-summary__heading'
      id={headingId}
      size={HEADING_SIZE_MAP[size ?? 'md']}
      spacing
      ref={ref}
      {...rest}
    />
  );
});

ErrorSummaryHeading.displayName = 'ErrorSummaryHeading';
