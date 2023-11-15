import React, { useContext } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import { Heading, Paragraph } from '../../Typography';
import { Button } from '../../Button';
import { Divider } from '../../Divider';
import { ModalContext } from '../ModalContext';

import classes from './ModalHeader.module.css';

type ModalHeaderProps = {
  closeButton?: boolean;
  headerTitle: React.ReactNode;
  headerSubtitle?: string;
  divider?: boolean;
};

export const ModalHeader = ({
  closeButton = true,
  headerTitle,
  headerSubtitle,
  divider = false,
}: ModalHeaderProps) => {
  const context = useContext(ModalContext);

  return (
    <>
      <div
        className={cn(
          classes.modalHeader,
          !closeButton && classes.noCloseButton,
          divider && classes.hasDivider,
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
      {divider && (
        <Divider
          color='default'
          style={{ margin: 0 }}
        />
      )}
    </>
  );
};
