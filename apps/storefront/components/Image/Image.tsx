import { Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';

import classes from './Image.module.css';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  boxShadow: boolean;
  caption: string;
  dataUnstyled?: boolean;
}

const Image = ({
  alt,
  src,
  boxShadow,
  caption,
  dataUnstyled = false,
  ...rest
}: ImageProps) => {
  return (
    <figure
      className={cl(classes.container, { [classes.boxShadow]: boxShadow })}
      {...(dataUnstyled ? { 'data-unstyled': '' } : {})}
    >
      <img
        className={classes.img}
        src={src}
        alt={alt}
        {...rest}
        aria-label={alt}
      ></img>
      {caption && (
        <Paragraph size='sm' asChild>
          <figcaption>{caption}</figcaption>
        </Paragraph>
      )}
    </figure>
  );
};

export { Image };
