import { Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import classes from './ColorTokens.module.css';
export const ColorTokens = () => {
  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <Heading data-size='xs' className={classes.title}>
          Se fargetokens
        </Heading>
        <Paragraph data-size='sm' className={classes.desc}>
          Her ser du hvilke tokens som er brukt for å lage kortene i seksjonen
          over.
        </Paragraph>
      </div>
      <div className={cl(classes.panel)}>
        <img className={classes.img} src='img/color-tokens.png' alt='' />
      </div>
    </div>
  );
};
