import React from 'react';
import type { HTMLAttributes } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import { Heading, Paragraph } from '../Typography';
import { Button } from '../Button';
import { Divider } from '../Divider';

import classes from './Modal.module.css';

export const ModalContent = ({
  children,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      {...props}
      className={cn(classes.modalContent, props.className)}
    >
      {children}
    </div>
  );
};

type ModalFooterProps = {
  divider?: boolean;
};

export const ModalFooter = ({
  divider = false,
  children,
  ...props
}: ModalFooterProps & HTMLAttributes<HTMLElement>) => {
  return (
    <>
      {divider && <Divider color='default' />}
      <footer
        {...props}
        className={cn(classes.modalFooter, props.className)}
      >
        {children}
      </footer>
    </>
  );
};

ModalContent.displayName = 'Modal.Content';
ModalFooter.displayName = 'Modal.Footer';

type ModalHeaderProps = {
  closeButton?: boolean;
  headerTitle: React.ReactNode;
  headerSubtitle?: string;
  divider?: boolean;
  onClose?: () => void;
};

export const ModalHeader = ({
  closeButton = true,
  headerTitle,
  headerSubtitle,
  divider = false,
  onClose,
}: ModalHeaderProps) => (
  <>
    <div
      className={cn(
        classes.modalHeader,
        !closeButton && classes.noCloseButton,
        divider && classes.divider,
      )}
    >
      {headerSubtitle && (
        <Paragraph
          size='small'
          variant='short'
        >
          {headerSubtitle}
        </Paragraph>
      )}
      <Heading
        level={2}
        size='xsmall'
      >
        {headerTitle}
      </Heading>
      {closeButton && (
        <Button
          name='close'
          variant='tertiary'
          color='second'
          size='medium'
          onClick={onClose}
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
    {divider && <Divider color='default' />}
  </>
);
