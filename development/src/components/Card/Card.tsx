import React from 'react';
import classes from './Card.module.css';
import { PersonIcon } from '@navikt/aksel-icons';

type CardProps = {
  children: React.ReactNode;
  title: string;
  user: string;
  userAvatar: string;
  PRNumber: number;
  PRLink: string;
};

export const Card = ({
  children,
  title,
  user,
  userAvatar,
  PRNumber,
  PRLink,
}: CardProps) => {
  return (
    <div className={classes.card}>
      <div className={classes.top}>
        <h2>
          <a
            href={PRLink}
            className={classes.link}
            target='blank'
          >
            {title} <span className={classes.number}> #{PRNumber}</span>
          </a>
        </h2>
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
