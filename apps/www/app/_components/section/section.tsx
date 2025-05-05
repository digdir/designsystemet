import { Heading } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import type * as React from 'react';

import { ContentContainer } from '../content-container/content-container';
import classes from './section.module.css';

type SectionProps = {
  children: React.ReactNode;
  title?: string;
  backgroundColor?: 'white' | 'grey';
  detail?: 'diamond';
} & React.HTMLAttributes<HTMLDivElement>;

const Section = ({
  children,
  title,
  backgroundColor = 'grey',
  detail,
  ...props
}: SectionProps) => {
  return (
    <div className={cl(classes.section, classes[backgroundColor])} {...props}>
      <ContentContainer>
        <div className={classes.header}>
          {title && (
            <Heading level={2} data-size='md'>
              {title}
            </Heading>
          )}
          <div className={classes.separator}>
            <div className={classes.separatorContainer}>
              <img src='/img/emblem.svg' alt='' />
            </div>
          </div>
          {detail && (
            <img
              src='/img/diamond-logo.svg'
              alt=''
              className={classes.detail}
            />
          )}
        </div>
        <div className={classes.content}>{children}</div>
      </ContentContainer>
    </div>
  );
};

export { Section };
