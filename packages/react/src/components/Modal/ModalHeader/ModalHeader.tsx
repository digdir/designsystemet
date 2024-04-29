import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import cl from 'clsx';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Slot } from '@radix-ui/react-slot';

import { Heading, Paragraph } from '../../Typography';
import { Button } from '../../Button';
import { ModalContext } from '../ModalRoot';

import classes from './ModalHeader.module.css';

export type ModalHeaderProps = {
  /**
   * Display close button.
   * @default true
   */
  closeButton?: boolean;
  subtitle?: string;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ closeButton = true, children, subtitle, asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';

    const context = useContext(ModalContext);

    return (
      <Component
        ref={ref}
        className={cl(classes.modalHeader, !closeButton && classes.noCloseButton, className)}
        {...rest}
      >
        {subtitle && (
          <Paragraph
            size='small'
            variant='short'
          >
            {subtitle}
          </Paragraph>
        )}
        <Heading
          level={2}
          size='xsmall'
        >
          {children}
        </Heading>
        {closeButton && (
          <Button
            name='close'
            variant='tertiary'
            color='second'
            size='medium'
            onClick={context?.closeModal}
            autoFocus
            icon={true}
            className={classes.modalHeaderButton}
          >
            <XMarkIcon
              title='close modal'
              fontSize='1.5em'
            />
          </Button>
        )}
      </Component>
    );
  },
);

ModalHeader.displayName = 'ModalHeader';
