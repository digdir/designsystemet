import React from 'react';
import Link from 'next/link';

import classes from './Card.module.css';

interface CardProps {
  title: string;
  description: string;
  url: string;
}

const Card = ({ title, description, url }: CardProps) => {
  return (
    <Link
      href={url}
      className={classes.card}
      prefetch={false}
    >
      <h3 className={classes.title}>{title}</h3>
      <div className={classes.date}>25.mars 2023</div>
      <p className={classes.desc}>{description}</p>
    </Link>
  );
};

export { Card };
