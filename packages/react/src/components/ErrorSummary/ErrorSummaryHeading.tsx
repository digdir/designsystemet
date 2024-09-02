import { forwardRef, useContext, useEffect } from 'react';

import { Heading, type HeadingProps } from '../Typography/Heading';

import { ErrorSummaryContext } from './ErrorSummaryRoot';

export type ErrorSummaryHeadingProps = Omit<HeadingProps, 'ref'>;

export const ErrorSummaryHeading = forwardRef<
  HTMLHeadingElement,
  ErrorSummaryHeadingProps
>(function ErrorSummaryHeading(
  { className, id, ...rest }: ErrorSummaryHeadingProps,
  ref,
) {
  const { headingId, setHeadingId } = useContext(ErrorSummaryContext);

  useEffect(() => {
    if (id && headingId !== id) setHeadingId(id);
  }, [headingId, id, setHeadingId]);

  return (
    <Heading
      className='ds-error-summary__heading'
      id={headingId}
      size='xs'
      spacing
      ref={ref}
      {...rest}
    />
  );
});

ErrorSummaryHeading.displayName = 'ErrorSummaryHeading';
