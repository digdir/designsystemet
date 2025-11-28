import type { ButtonProps } from '@digdir/designsystemet-react';
import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { PauseFillIcon, PlayFillIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type React from 'react';
import type { HTMLAttributes } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RRLink } from '../link';
import classes from './image-banner.module.css';

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
  link?: { text: string; href: string; prefix?: React.ReactNode };
  imgPosition?: 'left' | 'right';
  region?: React.ReactNode;
  regionPosition?: 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight';
  fallbackImgSrc?: string;
  fallbackImgAlt?: string;
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { t } = useTranslation();

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      className={cl(classes[backgroundColor], classes.section, className)}
      {...rest}
    >
      <div
        className={cl(
          classes.container,
          'l-content-container',
          imgPosition === 'right' ? classes.reverseContainer : '',
        )}
      >
        <div
          className={cl(classes.imgContainer, {
            [classes.smallImage]: imgWidth === 'small',
          })}
        >
          {videoSrc && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                loop
                className={classes.video}
              >
                <source src={videoSrc + '.webm'} type='video/webm' />
                <source src={videoSrc + '.mp4'} type='video/mp4' />
              </video>
              <Button
                className={classes.videoControl}
                data-size='sm'
                onClick={togglePlayPause}
                aria-label={
                  isPlaying
                    ? t('image-banner.pause-video')
                    : t('image-banner.play-video')
                }
                data-color='neutral'
                icon
              >
                {isPlaying ? (
                  <PauseFillIcon aria-hidden />
                ) : (
                  <PlayFillIcon aria-hidden />
                )}
              </Button>
            </>
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
        <div className={classes.textContainer}>
          {title ? (
            <Heading level={2} data-size='lg' className={classes.title}>
              {title}
            </Heading>
          ) : null}
          {description && <Paragraph data-size='lg'>{description}</Paragraph>}
          {content && content}
          {link && (
            <RRLink to={link.href} className={classes.link}>
              {link.prefix} {link.text}
            </RRLink>
          )}

          {buttons && (
            <div className={classes.buttons}>
              {buttons.map((item, index) => (
                <Button
                  key={index}
                  variant={item.variant ?? 'secondary'}
                  data-color={
                    (item.color as ButtonProps['data-color']) ?? 'accent'
                  }
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
      </div>
    </section>
  );
};

export type { ImageBannerButtonProps, ImageBannerProps };
export { ImageBanner };
