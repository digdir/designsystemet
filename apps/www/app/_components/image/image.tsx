import { Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';

import classes from './image.module.css';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  boxShadow: boolean;
  caption: string;
}

const Image = ({
  alt,
  src,
  boxShadow = false,
  caption,
  ...rest
}: ImageProps) => {
  return (
    <figure className={cl(classes.container, boxShadow && classes.boxShadow)}>
      <img
        className={classes.image}
        src={src}
        alt={alt}
        {...rest}
        aria-label={alt}
      ></img>
      {caption && (
        <Paragraph data-size='sm' asChild>
          <figcaption>{caption}</figcaption>
        </Paragraph>
      )}
    </figure>
  );
};

export { Image };
