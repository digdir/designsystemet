import type { Placement } from '@floating-ui/utils';
import cl from 'clsx/lite';
import { forwardRef, useId, useState } from 'react';

import { Popover, type PopoverProps } from '../Popover';
import { Paragraph } from '../Typography/Paragraph';

import { HelpTextIcon } from './HelpTextIcon';

export type HelpTextProps = {
  /**
   * Title for screen readers.
   **/
  title: string;
  /**
   * Size of the helptext
   * @default md
   */
  size?: PopoverProps['size'];
  /**
   * Placement of the Popover.
   * @default 'right'
   */
  placement?: Placement;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const HelpText = forwardRef<HTMLButtonElement, HelpTextProps>(
  function HelpText(
    {
      title,
      placement = 'right',
      size = 'md',
      className,
      children,
      ...rest
    }: HelpTextProps,
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const randomId = useId();

    return (
      <>
        <button
          className={cl(
            `ds-helptext--${size}`,
            'ds-helptext__button',
            `ds-focus`,
            className,
          )}
          onClick={() => setOpen(!open)}
          // @ts-ignore
          popovertarget={randomId}
          ref={ref}
          {...rest}
        >
          <HelpTextIcon
            filled
            className={cl(
              `ds-helptext__icon`,
              `ds-helptext__icon--filled`,
              className,
            )}
            openState={open}
          />
          <HelpTextIcon
            className={cl(`ds-helptext__icon`, className)}
            openState={open}
          />
          <span className={`ds-sr-only`}>{title}</span>
        </button>
        {/* TODO: Why is popover wrapped in paragraph here? */}
        <Paragraph size='md' asChild>
          <Popover
            id={randomId}
            className='ds-helptext__content'
            onClose={() => setOpen(false)}
            open={open}
            placement={placement}
            size={size}
            variant='info'
          >
            {children}
          </Popover>
        </Paragraph>
      </>
    );
  },
);
