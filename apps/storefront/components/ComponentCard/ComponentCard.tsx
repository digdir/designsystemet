import NextLink from 'next/link';
import { Heading } from '@digdir/designsystemet-react';

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
      <img
        src={'/img/component-previews/' + image}
        alt={title}
        className={classes.image}
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
