import { Link } from 'react-router-dom';

import classes from './Card.module.css';

type CardProps = {
  title: string;
  icon?: React.ReactNode;
  url: string;
  colors?: {
    brand1Base: string;
    brand2Base: string;
    brand3Base: string;
  };
};

export const Card = ({ title, icon, url, colors }: CardProps) => {
  return (
    <Link to={url} className={classes.card}>
      {icon && <div className={classes.icon}>{icon}</div>}
      {colors && (
        <div className={classes.circles}>
          <div
            className={classes.circle}
            style={{ backgroundColor: colors.brand1Base }}
          />
          <div
            className={classes.circle}
            style={{ backgroundColor: colors.brand2Base }}
          />
          <div
            className={classes.circle}
            style={{ backgroundColor: colors.brand3Base }}
          />
        </div>
      )}
      <div className={classes.title}>{title}</div>
    </Link>
  );
};
