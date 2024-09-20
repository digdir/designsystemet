import { XMarkIcon } from '@navikt/aksel-icons';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { Button } from '../Button';
import { Heading, Paragraph } from '../Typography';

import { ModalContext } from './ModalRoot';

export type ModalHeaderProps = {
  /**
   * Display close button.
   * @default true
   */
  closeButton?: boolean;
  /**
   * The title of the close button.
   * @default 'close modal'
   */
  closeButtonTitle?: string;
  /**
   * The subtitle of the modal.
   */
  subtitle?: string;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  (
    {
      closeButton = true,
      closeButtonTitle = 'close modal',
      children,
      subtitle,
      asChild,
      className,
      ...rest
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

    const { closeModal } = useContext(ModalContext);

    return (
      <Component
        ref={ref}
        className={cl('ds-modal__header', className)}
        {...rest}
      >
        {subtitle && (
          <Paragraph size='sm' variant='short'>
            {subtitle}
          </Paragraph>
        )}
        <Heading level={2} size='xs'>
          {children}
        </Heading>
        {closeButton && (
          <Button
            name='close'
            variant='tertiary'
            color='neutral'
            size='md'
            onClick={() => closeModal?.()}
            autoFocus
            icon
            className='ds-modal__header__button'
            title={closeButtonTitle}
          />
        )}
      </Component>
    );
  },
);

ModalHeader.displayName = 'ModalHeader';
