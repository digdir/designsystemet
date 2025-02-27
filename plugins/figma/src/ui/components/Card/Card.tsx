import cl from 'clsx/lite';
import { Link } from 'react-router-dom';
import classes from './Card.module.css';

type CardProps = {
  title: string;
  icon?: React.ReactNode;
  url: string;
  colors?: {
    colorDot1: string;
    colorDot2: string;
    colorDot3: string;
  };
};

export const Card = ({ title, icon, url, colors }: CardProps) => {
  return (
    <Link to={url} className={cl(classes.card, 'ds-focus')}>
      {icon && <div className={classes.icon}>{icon}</div>}
      {colors && (
        <div className={classes.circles}>
          <div
            className={classes.circle}
            style={{ backgroundColor: colors.colorDot1 }}
          />
          <div
            className={classes.circle}
            style={{ backgroundColor: colors.colorDot2 }}
          />
          <div
            className={classes.circle}
            style={{ backgroundColor: colors.colorDot3 }}
          />
        </div>
      )}
      <div className={classes.title}>{title}</div>
    </Link>
  );
};
