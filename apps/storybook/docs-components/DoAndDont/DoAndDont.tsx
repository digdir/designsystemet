import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';

import { Heading, Paragraph } from '@digdir/designsystemet-react';

import styles from './DoAndDont.module.css';

const Wrapper = ({ variant, description, image, alt }: WrapperProps) => {
  const icon = variant === 'do' ? <CheckmarkIcon /> : <XMarkIcon />;
  const heading = variant === 'do' ? 'Gjør' : 'Unngå';

  return (
    <figure
      className={cl(styles.wrapper, styles[variant])}
      data-ds-color-mode='light'
    >
      <div className={styles.header}>
        <div className={styles.icon}>{icon}</div>
        <Heading
          level={2}
          data-size='sm'
          style={{
            margin: 0,
            border: 'none',
          }}
          className='sb-unstyled'
        >
          {heading}
        </Heading>
      </div>
      <figcaption>
        <Paragraph className={cl(styles.description, 'sb-unstyled')}>
          {description}
        </Paragraph>
      </figcaption>

      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={alt ? alt : `${heading}: ${description}`}
          draggable={false}
        />
      </div>
    </figure>
  );
};

export const Do = ({ description, image, alt }: DoAndDontProps) => {
  return (
    <Wrapper variant='do' description={description} image={image} alt={alt} />
  );
};

export const Dont = ({ description, image, alt }: DoAndDontProps) => {
  return (
    <Wrapper variant='dont' description={description} image={image} alt={alt} />
  );
};

type DoAndDontProps = {
  description: string;
  image: string;
  alt?: string;
};

type WrapperProps = DoAndDontProps & {
  variant: 'do' | 'dont';
};
