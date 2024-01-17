import type { HTMLAttributes } from 'react';
import React from 'react';

import { ListItem } from '../List';

type ErrorSummaryItemProps = HTMLAttributes<HTMLLIElement>;

export const ErrorSummaryItem = ({ ...rest }: ErrorSummaryItemProps) => {
  return <ListItem {...rest} />;
};
