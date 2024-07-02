import cl from 'clsx';
import { Paragraph } from '@digdir/designsystemet-react';

import classes from './Image.module.css';

interface ImageProps {
  alt: string;
  src: string;
  boxShadow: boolean;
  caption: string;
}

const Image = ({ alt, src, boxShadow, caption, ...rest }: ImageProps) => {
  return (
    <figure
      className={cl(classes.container, { [classes.boxShadow]: boxShadow })}
    >
      <img
        className={classes.img}
        src={src}
        alt={alt}
        {...rest}
      ></img>
      {caption && (
        <Paragraph
          size='sm'
          asChild
        >
          <figcaption>{caption}</figcaption>
        </Paragraph>
      )}
    </figure>
  );
};

export { Image };
