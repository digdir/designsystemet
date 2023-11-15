import type { HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import { Heading, Paragraph } from '../../Typography';
import { Button } from '../../Button';
import { ModalContext } from '../ModalContext';

import classes from './ModalHeader.module.css';

type ModalHeaderProps = {
  closeButton?: boolean;
  title: React.ReactNode;
  subtitle?: string;
} & HTMLAttributes<HTMLDivElement>;

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ closeButton = true, title, subtitle, ...rest }, ref) => {
    const context = useContext(ModalContext);

    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          classes.modalHeader,
          !closeButton && classes.noCloseButton,
          rest.className,
        )}
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
          {title}
        </Heading>
        {closeButton && (
          <Button
            name='close'
            variant='tertiary'
            color='second'
            size='medium'
            onClick={context?.closeModal}
            autoFocus
            icon={
              <XMarkIcon
                title='close modal'
                fontSize='1.5em'
              />
            }
          />
        )}
      </div>
    );
  },
);
