import { Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import classes from './Card.module.css';

type CardProps = {
  type?: 1 | 2 | 3;
  title: string;
  desc: string;
  icon: React.ReactNode;
};

export const Card = ({ type, title, desc, icon }: CardProps) => {
  return (
    <div
      className={cl(
        classes.card,
        (type === 1 || type === 3) && classes.bg,
        type === 1 && classes.borderLight,
        type === 2 && classes.borderDark,
      )}
    >
      <div className={classes.content}>
        <div
          className={cl(
            classes.icon,
            type === 1 && classes.iconLight,
            type === 2 && classes.iconDark,
          )}
        >
          {icon}
        </div>
        <Heading
          className={cl(classes.title, type === 2 && classes.titleColored)}
          data-size='2xs'
        >
          {title}
        </Heading>
        <Paragraph data-size='sm'>{desc}</Paragraph>
      </div>
    </div>
  );
};
