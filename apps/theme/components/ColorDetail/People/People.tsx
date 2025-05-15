import { Paragraph } from '@digdir/designsystemet-react';
import classes from './People.module.css';

export const People = () => {
  return (
    <div className={classes.people}>
      <Paragraph data-size='sm' className={classes.text}>
        Eksempel som viser de tre base fargene
      </Paragraph>
      <div className={classes.panel}></div>
      <img className={classes.img} src='img/dog.png' alt='' />
    </div>
  );
};
