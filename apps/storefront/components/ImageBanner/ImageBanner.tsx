'use client';
import type { ButtonProps } from '@digdir/designsystemet-react';
import { Button, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { Container } from '@repo/components';
import cl from 'clsx/lite';
import NextLink from 'next/link';
import type React from 'react';

import type { HTMLAttributes } from 'react';
import classes from './ImageBanner.module.css';

type ImageBannerProps = {
  title?: string;
  description?: string;
  imgSrc?: string;
  videoSrc?: string;
  imgAlt?: string;
  headingLevel?: 'h1' | 'h2';
  content?: React.ReactNode;
  children?: React.ReactNode;
  imgWidth: string;
  backgroundColor?: 'blue' | 'yellow' | 'red' | 'white';
  buttons?: ImageBannerButtonProps[];
  link?: { text: string; href: string; prefix: React.ReactNode };
  imgPosition?: 'left' | 'right';
  region?: React.ReactNode;
  regionPosition?: 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight';
  fallbackImgSrc: string;
  fallbackImgAlt: string;
} & HTMLAttributes<HTMLDivElement>;

type ImageBannerButtonProps = {
  text: string;
  prefix?: React.ReactNode;
  href: string;
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
};

const ImageBanner = ({
  title,
  description,
  imgSrc,
  videoSrc,
  content,
  imgWidth,
  backgroundColor = 'white',
  children,
  buttons,
  link,
  imgPosition = 'left',
  imgAlt = '',
  headingLevel = 'h1',
  fallbackImgSrc,
  fallbackImgAlt,
  className,
  ...rest
}: ImageBannerProps) => {
  return (
    <div
      className={cl(classes[backgroundColor], classes.section, className)}
      {...rest}
    >
      <Container className={cl(classes.container)}>
        {imgPosition === 'left' && (
          <div
            className={cl(classes.imgContainer, {
              [classes.smallImage]: imgWidth === 'small',
            })}
          >
            {videoSrc && (
              <video autoPlay playsInline muted loop className={classes.video}>
                <source src={videoSrc + '.webm'} type='video/webm' />
                <source src={videoSrc + '.mp4'} type='video/mp4' />
              </video>
            )}
            {imgSrc && (
              <img className={cl(classes.img)} src={imgSrc} alt={imgAlt} />
            )}
            {fallbackImgSrc && (
              <img
                className={cl(classes.img, classes.fallbackImg)}
                src={fallbackImgSrc}
                alt={fallbackImgAlt}
              />
            )}
          </div>
        )}

        <div className={classes.textContainer}>
          {title ? (
            <Heading level={2} size='lg' className={classes.title}>
              {title}
            </Heading>
          ) : null}
          {description && <Paragraph size='lg'>{description}</Paragraph>}
          {content && content}
          {link && (
            <Link className={classes.link} color='neutral' asChild>
              <NextLink href={link.href}>
                {link.prefix} {link.text}
              </NextLink>
            </Link>
          )}

          {buttons && (
            <div className={classes.buttons}>
              {buttons.map((item, index) => (
                <Button
                  key={index}
                  variant={item.variant ?? 'secondary'}
                  color={item.color ?? 'accent'}
                  asChild
                >
                  <a href={item.href} className={classes.button}>
                    {item.prefix}
                    {item.text}
                  </a>
                </Button>
              ))}
            </div>
          )}

          {children}
        </div>
        {imgPosition === 'right' && (
          <div className={classes.imgContainer}>
            {videoSrc && (
              <video autoPlay playsInline muted loop className={classes.video}>
                <source src={videoSrc + '.webm'} type='video/webm' />
                <source src={videoSrc + '.mp4'} type='video/mp4' />
              </video>
            )}
            {imgSrc && (
              <img className={cl(classes.img)} alt={imgAlt} src={imgSrc} />
            )}
            {fallbackImgSrc && (
              <img
                className={cl(classes.img, classes.fallbackImg)}
                src={fallbackImgSrc}
                alt={fallbackImgAlt}
              />
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export type { ImageBannerButtonProps, ImageBannerProps };
export { ImageBanner };
