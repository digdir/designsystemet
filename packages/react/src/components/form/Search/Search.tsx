import cl from 'clsx/lite';
import { forwardRef } from 'react';

import type { DefaultProps } from '../../../types';

export type SearchProps = DefaultProps & React.HTMLAttributes<HTMLDivElement>;

export const Search = forwardRef<HTMLDivElement, SearchProps>(function Search(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cl('ds-search', className)} {...rest} />;
});
