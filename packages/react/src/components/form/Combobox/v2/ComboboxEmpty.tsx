import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import '@u-elements/u-datalist';

import type { DefaultProps } from '../../../../types';

export type ComboboxEmptyProps = HTMLAttributes<HTMLDivElement> & DefaultProps;
export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  function ComboboxEmpty(rest, ref) {
    return <div ref={ref} {...rest} />;
  },
);
