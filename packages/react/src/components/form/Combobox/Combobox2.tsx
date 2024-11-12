import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useRef } from 'react';
import type { DefaultProps } from '../../../types';

export type Combobox2Props = HTMLAttributes<HTMLDivElement> & DefaultProps;
export const Combobox2 = forwardRef<HTMLDivElement, Combobox2Props>(
  function Combobox2({ className, ...rest }, ref) {
    const fieldRef = useRef<HTMLDivElement>(null);
    const mergedRefs = useMergeRefs([fieldRef, ref]);

    return (
      <div
        className={cl('ds-combobox2', className)}
        ref={mergedRefs}
        {...rest}
      />
    );
  },
);
