import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { Color } from '../../colors';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type DetailsProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Details background color.
     * @default neutral
     */
    'data-color'?: 'subtle' | Color;
    /**
     * Show border
     * @default false
     **/
    border?: boolean;
    /** Instances of `Details.Item` */
    children: ReactNode;
  }
>;

/**
 * Details component, contains `Details.Item` components.
 */
export const Details = forwardRef<HTMLDivElement, DetailsProps>(
  function Details(
    { border = false, 'data-color': color = 'neutral', className, ...rest },
    ref,
  ) {
    return (
      <div
        className={cl('ds-details-group', className)}
        data-border={border || undefined} /* Fallback to  */
        data-color={color}
        ref={ref}
        {...rest}
      />
    );
  },
);
