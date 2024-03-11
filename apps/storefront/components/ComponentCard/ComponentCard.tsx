import NextLink from 'next/link';
import Image from 'next/image';
import { Heading } from '@digdir/design-system-react';

import classes from './ComponentCard.module.css';
type ComponentCardProps = {
  title: string;
  image: string;
  url: string;
};

const ComponentCard = ({ title, image, url }: ComponentCardProps) => {
  return (
    <NextLink
      href={url}
      className={classes.card}
    >
      <Image
        src={'/img/component-previews/' + image}
        alt={title}
        width={217}
        height={106}
      />
      <Heading
        size='xsmall'
        className={classes.title}
        level={2}
      >
        {title}
      </Heading>
    </NextLink>
  );
};

export { ComponentCard };
