import { Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';

import classes from './ColorCard.module.css';

type ColorCardProps = {
  brand: 'one' | 'two' | 'three';
  icon: React.ReactNode;
};

export const ColorCard = ({ brand, icon }: ColorCardProps) => {
  return (
    <div
      className={cl(
        classes.colorCard,
        brand === 'two' && classes.colorCardTwo,
        brand === 'three' && classes.colorCardThree,
      )}
    >
      <div
        className={cl(
          classes.colorCardIcon,
          brand === 'two' && classes.colorCardIconTwo,
          brand === 'three' && classes.colorCardIconThree,
        )}
      >
        {icon}
      </div>
      <div
        className={cl(
          classes.text,
          brand === 'two' && classes.textTwo,
          brand === 'three' && classes.textThree,
        )}
      >
        <Heading size='2xs' className={classes.colorCardTitle}>
          Grafikk one
        </Heading>
        <Paragraph size='sm' className={classes.colorCardDesc}>
          Her er ein beskrivelse
        </Paragraph>
      </div>
    </div>
  );
};
