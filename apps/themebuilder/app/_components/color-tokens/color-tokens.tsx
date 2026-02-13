import { Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import classes from './color-tokens.module.css';
export const ColorTokens = () => {
  const { t } = useTranslation();
  return (
    <div className='panelContainer'>
      <div className='panelLeft'>
        <div className='panelTop'>
          <Heading data-size='xs'>{t('color-tokens.title')}</Heading>
          <Paragraph data-size='sm'>{t('color-tokens.description')}</Paragraph>
        </div>
      </div>
      <div className={cl('panelRight', classes.right)}>
        <img className={classes.img} src='/img/color-tokens.png' alt='' />
      </div>
    </div>
  );
};
