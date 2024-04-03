import type * as React from 'react';
import cl from 'clsx';
import Image from 'next/image';

import { Container } from '../Container/Container';

import classes from './Section.module.css';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  backgroundColor?: 'white' | 'grey';
  detail?: 'diamond';
}

const Section = ({
  children,
  title,
  backgroundColor = 'grey',
  detail,
}: SectionProps) => {
  return (
    <div className={cl(classes.section, classes[backgroundColor])}>
      <Container>
        <div className={classes.header}>
          {title && <h2 className={classes.title}>{title}</h2>}
          <div className={classes.separator}>
            <div className={classes.separatorContainer}>
              <img
                src='img/emblem.svg'
                alt=''
              />
            </div>
          </div>
          {detail && (
            <Image
              src='img/diamond-logo.svg'
              alt=''
              className={classes.detail}
            />
          )}
        </div>
        <div className={classes.content}>{children}</div>
      </Container>
    </div>
  );
};

export { Section };
