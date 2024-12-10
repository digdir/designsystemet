import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { BorderRadiusInput } from '../../BorderRadiusInput/BorderRadiusInput';
import { TokenModal } from '../../TokenModal/TokenModal';
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

      <div className={classes.bottom}>
        <div className={classes.btnGroup}>
          <TokenModal />
          {/* <Button
            data-size='sm'
            className={classes.btn}
            onClick={() => onPrevClick()}
            asChild
          >
            <NextLink href='result'>
              <SparklesIcon title='a11y-title' fontSize='1.5rem' />
              Fullfør tema
            </NextLink>
          </Button> */}
        </div>
      </div>
    </div>
  );
};
