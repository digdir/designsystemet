import React from 'react';
import cn from 'classnames';
import { Heading, Paragraph } from '@digdir/design-system-react';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';

import styles from './DoAndDont.module.css';

function Wrapper({ variant, description, image }: WrapperProps) {
  const icon = variant === 'do' ? <CheckmarkIcon /> : <XMarkIcon />;
  const heading = variant === 'do' ? 'Gjør' : 'Unngå';

  return (
    <div className={cn(styles.wrapper, styles[variant])}>
      <div className={styles.header}>
        <div className={styles.icon}>{icon}</div>
        <Heading
          level={2}
          size='small'
          spacing={false}
          style={{
            margin: 0,
            border: 'none',
          }}
        >
          {heading}
        </Heading>
      </div>
      <Paragraph className={styles.description}>{description}</Paragraph>
      <div className={styles.image}>
        <img
          src={image}
          alt={heading}
        />
      </div>
    </div>
  );
}

export function Do({ description, image }: DoAndDontProps) {
  return (
    <Wrapper
      variant='do'
      description={description}
      image={image}
    />
  );
}

export function Dont({ description, image }: DoAndDontProps) {
  return (
    <Wrapper
      variant='dont'
      description={description}
      image={image}
    />
  );
}

interface DoAndDontProps {
  description: string;
  image: string;
}

interface WrapperProps extends DoAndDontProps {
  variant: 'do' | 'dont';
}
