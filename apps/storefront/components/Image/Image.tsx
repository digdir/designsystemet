import cl from 'clsx';

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
        <figcaption className={classes.caption}>{caption}</figcaption>
      )}
    </figure>
  );
};

export { Image };
