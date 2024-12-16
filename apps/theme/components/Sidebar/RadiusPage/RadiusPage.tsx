import { Heading } from '@digdir/designsystemet-react';
import { BorderRadiusInput } from '../../BorderRadiusInput/BorderRadiusInput';
import classes from './RadiusPage.module.css';

type RadiusPageProps = {
  onPrevClick: () => void;
  onNextClick?: () => void;
};

export const RadiusPage = ({ onPrevClick, onNextClick }: RadiusPageProps) => {
  return (
    <div>
      <Heading className={classes.heading} data-size='xs'>
        Velg border radius
      </Heading>

      <BorderRadiusInput />
    </div>
  );
};
