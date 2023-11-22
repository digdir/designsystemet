import React, { useEffect, useState, createElement, useRef } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { Container } from '../Container/Container';

import classes from './ImageBanner.module.css';

import * as LottiePlayer from '@lottiefiles/lottie-player';

interface ImageSectionProps {
  title?: string;
  description?: string;
  imgSrc: string;
  imgAlt?: string;
  headingLevel?: 'h1' | 'h2';
  content?: React.ReactNode;
  children?: React.ReactNode;
  imgWidth: number;
  imgHeight: number;
  backgroundColor?: 'blue' | 'yellow' | 'red' | 'white';
  buttons?: ImageSectionButtonProps[];
  link?: { text: string; href: string; prefix: React.ReactNode };
  imgPosition?: 'left' | 'right';
  region?: React.ReactNode;
  regionPosition?: 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight';
}

type ImageSectionButtonProps = {
  text: string;
  prefix?: React.ReactNode;
  href: string;
};

const ImageBanner = ({
  title,
  description,
  imgSrc,
  content,
  imgHeight,
  imgWidth,
  backgroundColor = 'white',
  children,
  buttons,
  link,
  imgPosition = 'left',
  imgAlt = '',
  headingLevel = 'h1',
  region,
  regionPosition = 'topLeft',
}: ImageSectionProps) => {
  const [heading, setHeading] = useState<React.ReactNode | null>(null);
  const ref = useRef(null);

  useEffect(() => {
    setHeading(
      createElement(headingLevel, { className: classes.title }, title),
    );
  }, [headingLevel, title]);

  React.useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  return (
    <div className={(classes[backgroundColor], classes.section)}>
      <div className={classes.region}>{region}</div>
      <Container className={cn(classes.container)}>
        {imgPosition === 'left' && (
          <div className={classes.imgContainer}>
            <lottie-player
              autoplay
              loop
              mode='normal'
              ref={ref}
              src='/animations/animation2.json'
              style={{ width: '430px' }}
            ></lottie-player>
          </div>
        )}

        <div className={classes.textContainer}>
          {title && heading}
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
                  {item.prefix}
                  {item.text}
                </a>
              ))}
            </div>
          )}

          {children}
        </div>
        {imgPosition === 'right' && (
          <div className={classes.imgContainer}>
            <lottie-player
              autoplay
              loop
              mode='normal'
              ref={ref}
              src='/animations/animation1.json'
              style={{ width: '370px' }}
            ></lottie-player>
          </div>
        )}
      </Container>
    </div>
  );
};

export type { ImageSectionButtonProps, ImageSectionProps };
export { ImageBanner };
