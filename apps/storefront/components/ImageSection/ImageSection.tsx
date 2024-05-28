import { useEffect, useState, createElement } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import cl from 'clsx';

import { Container } from '../Container/Container';

import classes from './ImageSection.module.css';

interface ImageSectionProps {
  title?: string;
  description?: string;
  imgSrc: string;
  imgAlt?: string;
  headingLevel?: 'h1' | 'h2';
  content?: ReactNode;
  children?: ReactNode;
  imgWidth: number;
  imgHeight: number;
  backgroundColor?: 'blue' | 'yellow' | 'red' | 'white';
  buttons?: ImageSectionButtonProps[];
  link?: { text: string; href: string; prefix: ReactNode };
  imgPosition?: 'left' | 'right';
}

type ImageSectionButtonProps = {
  text: string;
  prefix?: ReactNode;
  href: string;
};

const ImageSection = ({
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
}: ImageSectionProps) => {
  const [heading, setHeading] = useState<ReactNode | null>(null);

  useEffect(() => {
    setHeading(
      createElement(headingLevel, { className: classes.title }, title),
    );
  }, [headingLevel, title]);

  return (
    <div className={classes[backgroundColor]}>
      <Container className={cl(classes.section)}>
        {imgPosition === 'left' && (
          <div className={classes.imgContainer}>
            <Image
              className={classes.img}
              src={imgSrc}
              alt={imgAlt}
              height={imgHeight}
              width={imgWidth}
            />
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
            <Image
              className={classes.img}
              src={imgSrc}
              alt={imgAlt}
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
