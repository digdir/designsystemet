import { Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';

import classes from './image.module.css';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  boxShadow?: boolean;
  caption?: string;
}

const Image = ({
  alt,
  src,
  boxShadow = false,
  caption,
  ...rest
}: ImageProps) => {
  const [enlarged, setEnlarged] = useState(false);
  const toggleEnlarged = () => {
    setEnlarged(!enlarged);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
      event.preventDefault();
      setEnlarged(event.key !== 'Escape' ? !enlarged : false);
    }
  };
  // Add event listener for Escape key to close enlarged image
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (enlarged && event.key === 'Escape') {
        setEnlarged(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    // Disable scrolling when image is enlarged
    if (enlarged) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [enlarged]);
  return (
    <figure className={cl(classes.container, boxShadow && classes.boxShadow)}>
      <button
        type='button'
        className={cl(classes.imageWrapper, enlarged && classes.enlarged)}
        onClick={toggleEnlarged}
        onKeyDown={handleKeyDown}
        aria-label={`${alt}. ${
          enlarged ? 'Click to return to normal size.' : 'Click to enlarge.'
        }`}
      >
        {' '}
        <img className={classes.image} src={src} alt={alt} {...rest} />
        {enlarged && (
          <span className={classes.enlargedText}>
            Click image or press Escape to close
          </span>
        )}
      </button>
      {caption && (
        <Paragraph data-size='sm' asChild>
          <figcaption>{caption}</figcaption>
        </Paragraph>
      )}
    </figure>
  );
};

export { Image };
