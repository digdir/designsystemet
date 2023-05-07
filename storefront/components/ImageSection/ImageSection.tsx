import React from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { Container } from '../Container/Container';

import classes from './ImageSection.module.css';

interface ImageSectionProps {
  title?: string;
  description?: string;
  src: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
  imgWidth: number;
  imgHeight: number;
  color?: 'blue' | 'yellow' | 'red' | 'white';
}

const ImageSection = ({
  title,
  description,
  src,
  content,
  imgHeight,
  imgWidth,
  color = 'white',
  children,
}: ImageSectionProps) => {
  return (
    <div className={classes[color]}>
      <Container className={cn(classes.section)}>
        <div className={classes.left}>
          <Image
            className={classes.img}
            src={src}
            alt='Image'
            height={imgHeight}
            width={imgWidth}
          />
        </div>

        <div className={classes.right}>
          {title && <h2 className={classes.title}>{title}</h2>}
          {description && <p className={classes.desc}>{description}</p>}
          {content && content}
          {children}
        </div>
      </Container>
    </div>
  );
};

export { ImageSection };
