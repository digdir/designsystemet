import { Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import classes from './ColorTokens.module.css';
export const ColorTokens = () => {
  return (
    <div className='panelContainer'>
      <div className='panelLeft'>
        <div className='panelTop'>
          <Heading data-size='xs'>Se fargetokens</Heading>
          <Paragraph data-size='sm'>
            Her ser du hvilke tokens som er brukt for å lage kortene i seksjonen
            over.
          </Paragraph>
        </div>
      </div>
      <div className={cl('panelRight', classes.right)}>
        <img className={classes.img} src='img/color-tokens.png' alt='' />
      </div>
    </div>
  );
};
