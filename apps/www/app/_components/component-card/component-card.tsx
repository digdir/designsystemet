import cl from 'clsx/lite';

import { Link } from 'react-router';
import classes from './component-card.module.css';

type ComponentCardProps = {
  title: string;
  image: string;
  url: string;
};

const ComponentCard = ({ title, image, url }: ComponentCardProps) => {
  return (
    <Link to={url} className={cl(classes.card, 'ds-focus')}>
      <img
        src={'/img/component-previews/' + image}
        alt={title}
        className={classes.image}
        aria-hidden='true'
      />
      <div data-size='lg' className={classes.title}>
        {title}
      </div>
    </Link>
  );
};

export { ComponentCard };
