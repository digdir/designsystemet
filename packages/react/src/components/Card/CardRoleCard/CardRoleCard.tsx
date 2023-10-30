import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';
import { TrashFillIcon } from '@navikt/aksel-icons';

import classes from '../Card.module.css';
import { Card } from '..';
import { Paragraph } from '../../Typography';
import { Button } from '../../Button';

export type RoleCardProps = {
  /** Sets `title` of the Role Card. */
  title: string;
  /** Instances of `Card.Section` */
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const RoleCard = forwardRef<HTMLDivElement, RoleCardProps>(
  ({ title, children, ...rest }, ref) => (
    <Card
      {...rest}
      ref={ref}
      className={cn(classes.card, rest.className)}
    >
      <Card.Section
        direction='row'
        justifyContent='space-between'
        alignItems='align-center'
      >
        <Paragraph size='medium'>{title}</Paragraph>
        <Button
          variant='secondary'
          size='small'
          icon={<TrashFillIcon aria-hidden />}
        >
          Fjern
        </Button>
      </Card.Section>
      {children}
    </Card>
  ),
);
