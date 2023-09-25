import React from 'react';
import cn from 'classnames';
import { Heading, Paragraph } from '@digdir/design-system-react';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';

import styles from './DoAndDont.module.css';

function Wrapper({ variant, description, image, alt }: WrapperProps) {
  const icon = variant === 'do' ? <CheckmarkIcon /> : <XMarkIcon />;
  const heading = variant === 'do' ? 'Gjør' : 'Unngå';

  return (
    <figure className={cn(styles.wrapper, styles[variant])}>
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
      <figcaption>
        <Paragraph className={styles.description}>{description}</Paragraph>
      </figcaption>

      <img
        src={image}
        alt={alt ? alt : `${heading}: ${description}`}
        draggable={false}
      />
    </figure>
  );
}

export function Do({ description, image, alt }: DoAndDontProps) {
  return (
    <Wrapper
      variant='do'
      description={description}
      image={image}
      alt={alt}
    />
  );
}

export function Dont({ description, image, alt }: DoAndDontProps) {
  return (
    <Wrapper
      variant='dont'
      description={description}
      image={image}
      alt={alt}
    />
  );
}

interface DoAndDontProps {
  description: string;
  image: string;
  alt?: string;
}

interface WrapperProps extends DoAndDontProps {
  variant: 'do' | 'dont';
}
