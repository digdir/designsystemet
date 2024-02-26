import { useMemo } from 'react';
import cl from 'clsx';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';

import styles from './DoAndDont.module.css';

const Wrapper = ({ variant, description, image, alt }: WrapperProps) => {
  const icon = variant === 'do' ? <CheckmarkIcon /> : <XMarkIcon />;
  const heading = variant === 'do' ? 'Gjør' : 'Unngå';

  const aspectRatio = useMemo(() => {
    return getAspectRatio(image);
  }, [image]);

  return (
    <figure
      className={cl(
        styles.wrapper,
        styles[variant],
        aspectRatio > 2 && styles.landscape,
      )}
    >
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
    <Wrapper
      variant='do'
      description={description}
      image={image}
      alt={alt}
    />
  );
};

export const Dont = ({ description, image, alt }: DoAndDontProps) => {
  return (
    <Wrapper
      variant='dont'
      description={description}
      image={image}
      alt={alt}
    />
  );
};

const getAspectRatio = (image: string): number => {
  const img = new Image();
  img.src = image;

  const w = img.naturalWidth;
  const h = img.naturalHeight;

  return w / h;
};

type DoAndDontProps = {
  description: string;
  image: string;
  alt?: string;
};

type WrapperProps = DoAndDontProps & {
  variant: 'do' | 'dont';
};
