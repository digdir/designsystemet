import React from 'react';
import cn from 'classnames';

import classes from './Image.module.css';

interface ImageProps {
  alt: string;
  src: string;
  boxShadow: boolean;
}

const Image = ({ alt, src, boxShadow, ...rest }: ImageProps) => {
  return (
    <div className={cn(classes.container, { [classes.boxShadow]: boxShadow })}>
      <img
        className={classes.img}
        src={src}
        alt={alt}
        {...rest}
      ></img>
    </div>
  );
};

export { Image };
