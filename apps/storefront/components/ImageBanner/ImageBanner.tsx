import React, { useEffect, useState, createElement } from 'react';
import cn from 'clsx';

import { Container } from '../Container/Container';

import classes from './ImageBanner.module.css';

interface ImageSectionProps {
  title?: string;
  description?: string;
  imgSrc?: string;
  videoSrc?: string;
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
  videoSrc,
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
}: ImageSectionProps) => {
  const [heading, setHeading] = useState<React.ReactNode | null>(null);

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
      <Container className={cn(classes.container)}>
        {imgPosition === 'left' && (
          <div className={classes.imgContainer}>
            {videoSrc && (
              <video
                width='570'
                height='380'
                autoPlay
                muted
                loop
              >
                <source
                  src={videoSrc}
                  type='video/mp4'
                ></source>
              </video>
            )}
            {imgSrc && (
              <img
                className={classes.img}
                src={imgSrc}
                alt='22'
              />
            )}
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
            {videoSrc && (
              <video
                width='570'
                height='380'
                autoPlay
                muted
                loop
              >
                <source
                  src={videoSrc}
                  type='video/mp4'
                ></source>
              </video>
            )}
            {imgSrc && (
              <img
                className={classes.img}
                alt='dd'
                src={imgSrc}
              />
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export type { ImageSectionButtonProps, ImageSectionProps };
export { ImageBanner };
