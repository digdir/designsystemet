import React from 'react';
import Image from 'next/image';

import { Container } from '../Container/Container';

import classes from './ImageSection.module.css';

interface ImageSectionProps {
  title: string;
  description: string;
  src: string;
  content?: React.ReactNode;
  imgWidth: number;
  imgHeight: number;
}

const ImageSection = ({
  title,
  description,
  src,
  content,
  imgHeight,
  imgWidth,
}: ImageSectionProps) => {
  return (
    <Container className={classes.section}>
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
        <h2 className={classes.title}>{title}</h2>
        <p className={classes.desc}>{description}</p>
        {content && content}
      </div>
    </Container>
  );
};

export { ImageSection };
