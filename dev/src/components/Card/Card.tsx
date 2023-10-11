import React from 'react';
import classes from './Card.module.css';
import { PersonIcon } from '@navikt/aksel-icons';

type CardProps = {
  children: React.ReactNode;
  title: string;
  user: string;
  userAvatar: string;
};

export const Card = ({ children, title, user, userAvatar }: CardProps) => {
  return (
    <div className={classes.card}>
      <div className={classes.top}>
        <h2>{title}</h2>
        <div className={classes.author}>
          <img
            src={userAvatar}
            alt='User avatar'
            className={classes.avatar}
          />
          {user}
        </div>
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  );
};
