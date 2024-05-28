import type { ReactNode } from 'react';

import classes from './PullRequestCard.module.css';

type PullRequestCardProps = {
  children: ReactNode;
  title: string;
  user: string;
  userAvatar: string;
  PRNumber: number;
  PRLink: string;
};

export const PullRequestCard = ({
  children,
  title,
  user,
  userAvatar,
  PRNumber,
  PRLink,
}: PullRequestCardProps) => {
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
