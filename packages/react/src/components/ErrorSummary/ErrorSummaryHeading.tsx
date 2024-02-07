import { Slot } from '@radix-ui/react-slot';
import { useContext, useEffect } from 'react';

import type { ListHeadingProps } from '../List';
import { List } from '../List';

import { ErrorSummaryContext } from './ErrorSummary';

export type ErrorSummaryHeadingProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & ListHeadingProps;

export const ErrorSummaryHeading = ({
  asChild,
  id,
  ...rest
}: ErrorSummaryHeadingProps) => {
  const Component = asChild ? Slot : List.Heading;

  const { headingId, setHeadingId } = useContext(ErrorSummaryContext);

  useEffect(() => {
    if (id && headingId !== id) {
      setHeadingId(id);
    }
  }, [headingId, id, setHeadingId]);

  return (
    <Component
      {...rest}
      id={headingId}
    />
  );
};

ErrorSummaryHeading.displayName = 'ErrorSummary.Heading';
