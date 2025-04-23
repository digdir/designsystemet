import { Paragraph } from '@digdir/designsystemet-react';
import classes from './People.module.css';

export const People = () => {
  return (
    <div className={classes.people}>
      <Paragraph data-size='sm' className={classes.text}>
        Example showing the border colors in sections
      </Paragraph>
      <div className={classes.panel}></div>
      <img className={classes.img} src='img/couple-transparant.png' alt='' />
    </div>
  );
};
