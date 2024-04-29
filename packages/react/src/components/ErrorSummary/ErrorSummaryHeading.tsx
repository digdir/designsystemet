import { useContext, useEffect } from 'react';

import type { ListHeadingProps } from '../List';
import { List } from '../List';

import { ErrorSummaryContext } from './ErrorSummaryRoot';

export type ErrorSummaryHeadingProps = ListHeadingProps;

export const ErrorSummaryHeading = ({ id, ...rest }: ErrorSummaryHeadingProps) => {
  const { headingId, setHeadingId } = useContext(ErrorSummaryContext);

  useEffect(() => {
    if (id && headingId !== id) {
      setHeadingId(id);
    }
  }, [headingId, id, setHeadingId]);

  return (
    <List.Heading
      {...rest}
      id={headingId}
    />
  );
};

ErrorSummaryHeading.displayName = 'ErrorSummaryHeading';
