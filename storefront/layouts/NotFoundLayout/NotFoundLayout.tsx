import React from 'react';

import { Container } from '../../components/Container/Container';

import classes from './NotFoundLayout.module.css';
import Link from 'next/link';

interface NotFoundLayoutProps {
  content: React.ReactNode;
  data: {
    title: string;
    description: string;
  };
}

const NotFoundLayout = ({ content, data }: NotFoundLayoutProps) => {
  return (
    <div className={classes.content}>
      <Container className={classes.container}>
        <div className={classes.imgContainer}>
          <img
            src='/img/man-binoculars.svg'
            alt='Mann med kikkert'
          />
        </div>
        <div className={classes.textContainer}>
          <h1 className={classes.title}>
            {data.title} <span></span>
          </h1>
          <p className={classes.desc}>{data.description}</p>
          <Link
            className={classes.link}
            href='/'
          >
            Gå til forsiden
          </Link>
        </div>
      </Container>
      ;
    </div>
  );
};

export { NotFoundLayout };
export type { NotFoundLayoutProps };
