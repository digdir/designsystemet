import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { BorderRadiusInput } from '../../BorderRadiusInput/BorderRadiusInput';
import classes from './RadiusPage.module.css';

type RadiusPageProps = {
  onPrevClick: () => void;
  onNextClick?: () => void;
};

export const RadiusPage = ({ onPrevClick, onNextClick }: RadiusPageProps) => {
  return (
    <div>
      <Heading data-size='xs'>Velg border radius</Heading>
      <Paragraph data-size='sm' className={classes.desc}>
        Denne funksjonaliteten blir foreløpig ikkje med i kodesnutten for å ta i
        bruk et tema, men vi jobber med å få det inn!
      </Paragraph>

      {/* BORDER RADIUS */}
      <BorderRadiusInput />
    </div>
  );
};
