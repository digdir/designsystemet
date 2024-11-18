import { Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import classes from './ColorTokens.module.css';
export const ColorTokens = () => {
  return (
    <div className='panelContainer'>
      <div className='panelLeft'>
        <Heading data-size='xs'>Se fargetokens</Heading>
        <Paragraph data-size='sm'>Todo</Paragraph>
      </div>
      <div className={cl('panelRight', classes.right)}>
        <img className={classes.img} src='img/color-tokens.png' alt='' />
      </div>
    </div>
  );
};
