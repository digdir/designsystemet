import type * as React from 'react';
import NextLink from 'next/link';
import { Link } from '@digdir/designsystemet-react';
import Image from 'next/image';

import { Container } from '../../components/Container/Container';

import classes from './NotFoundLayout.module.css';

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
          <Image
            className={classes.img}
            src='/img/man-binoculars.svg'
            alt='Mann med kikkert'
            height={205}
            width={290}
          />
        </div>
        <div className={classes.textContainer}>
          <h1 className={classes.title}>{data.title}</h1>
          <p className={classes.desc}>{data.description}</p>
          <Link
            className={classes.link}
            asChild
          >
            <NextLink
              href='/'
              prefetch={false}
            >
              Gå til forsiden
            </NextLink>
          </Link>
        </div>
        {content}
      </Container>
      ;
    </div>
  );
};

export { NotFoundLayout };
export type { NotFoundLayoutProps };
