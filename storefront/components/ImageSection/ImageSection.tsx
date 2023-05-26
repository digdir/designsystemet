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
  backgroundColor?: 'blue' | 'yellow' | 'red' | 'white';
  buttons?: ImageSectionButtonProps[];
  link?: { text: string; href: string; prefix: React.ReactNode };
  imagePosition?: 'left' | 'right';
}

type ImageSectionButtonProps = {
  text: string;
  prefix?: React.ReactNode;
  href: string;
};

const ImageSection = ({
  title,
  description,
  src,
  content,
  imgHeight,
  imgWidth,
  backgroundColor = 'white',
  children,
  buttons,
  link,
  imagePosition = 'left',
}: ImageSectionProps) => {
  return (
    <div className={classes[backgroundColor]}>
      <Container className={cn(classes.section)}>
        {imagePosition === 'left' && (
          <div className={classes.imgContainer}>
            <Image
              className={classes.img}
              src={src}
              alt='Image'
              height={imgHeight}
              width={imgWidth}
            />
          </div>
        )}
        <div className={classes.textContainer}>
          {title && <h2 className={classes.title}>{title}</h2>}
          {description && <p className={classes.desc}>{description}</p>}
          {content && content}
          {link && (
            <a
              href={link.href}
              className={classes.link}
            >
              {link.prefix} {link.text}
            </a>
          )}

          {buttons && (
            <div className={classes.buttons}>
              {buttons.map((item, index) => (
                <a
                  href={item.href}
                  className={classes.button}
                  key={index}
                >
                  {item.prefix} {item.text}
                </a>
              ))}
            </div>
          )}

          {children}
        </div>
        {imagePosition === 'right' && (
          <div className={classes.imgContainer}>
            <Image
              className={classes.img}
              src={src}
              alt='Image'
              height={imgHeight}
              width={imgWidth}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export type { ImageSectionButtonProps, ImageSectionProps };
export { ImageSection };
