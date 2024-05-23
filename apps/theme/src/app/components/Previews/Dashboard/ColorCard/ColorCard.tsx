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
      className={cl(classes.colorCard, {
        [classes.colorCardTwo]: brand === 'two',
        [classes.colorCardThree]: brand === 'three',
      })}
    >
      <div
        className={cl(classes.colorCardIcon, {
          [classes.colorCardIconTwo]: brand === 'two',
          [classes.colorCardIconThree]: brand === 'three',
        })}
      >
        {icon}
      </div>
      <div
        className={cl(classes.text, {
          [classes.textTwo]: brand === 'two',
          [classes.textThree]: brand === 'three',
        })}
      >
        <Heading
          size='xxsmall'
          className={classes.colorCardTitle}
        >
          Grafikk one
        </Heading>
        <Paragraph
          size='small'
          className={classes.colorCardDesc}
        >
          Her er ein beskrivelse
        </Paragraph>
      </div>
    </div>
  );
};
