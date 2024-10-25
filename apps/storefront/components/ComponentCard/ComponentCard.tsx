import { Heading } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import NextLink from 'next/link';

import classes from './ComponentCard.module.css';

type ComponentCardProps = {
  title: string;
  image: string;
  url: string;
};

const ComponentCard = ({ title, image, url }: ComponentCardProps) => {
  return (
    <NextLink href={url} className={cl(classes.card, 'ds-focus')}>
      <img
        src={'/img/component-previews/' + image}
        alt={title}
        className={classes.image}
      />
      <Heading data-size='xs' className={classes.title} level={2}>
        {title}
      </Heading>
    </NextLink>
  );
};

export { ComponentCard };
