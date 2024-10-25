import { Heading } from '@digdir/designsystemet-react';
import { Container } from '@repo/components';
import cl from 'clsx/lite';
import Image from 'next/image';
import type * as React from 'react';

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
          {title && (
            <Heading level={2} data-size='md'>
              {title}
            </Heading>
          )}
          <div className={classes.separator}>
            <div className={classes.separatorContainer}>
              <img src='img/emblem.svg' alt='' />
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
