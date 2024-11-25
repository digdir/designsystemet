import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ChevronLeftIcon, SparklesIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useState } from 'react';
import { useThemeStore } from '../../../store';
import { BorderRadiusInput } from '../../BorderRadiusInput/BorderRadiusInput';
import classes from './RadiusPage.module.css';

type RadiusPageProps = {
  onPrevClick: () => void;
  onNextClick?: () => void;
};

export const RadiusPage = ({ onPrevClick, onNextClick }: RadiusPageProps) => {
  const borderRadius = useThemeStore((state) => state.borderRadius);
  const setBorderRadius = useThemeStore((state) => state.setBorderRadius);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <Heading data-size='xs'>Velg border radius</Heading>
      <Paragraph data-size='sm' className={classes.desc}>
        Logbook a sitting success parents' girl in it however, greater, full
        with he that pleasures up attention to hardly to power definitely hardly
      </Paragraph>
      {/* BORDER RADIUS */}

      <BorderRadiusInput onChange={(radius) => setBorderRadius(radius)} />

      <div className={classes.bottom}>
        <div className={classes.btnGroup}>
          <Button
            data-size='sm'
            className={classes.btn}
            onClick={() => onPrevClick()}
            variant='secondary'
          >
            <ChevronLeftIcon title='a11y-title' fontSize='1.5rem' />
            Farger
          </Button>
          <Button
            data-size='sm'
            className={classes.btn}
            onClick={() => onPrevClick()}
            asChild
          >
            <NextLink href='result'>
              <SparklesIcon title='a11y-title' fontSize='1.5rem' />
              Fullfør
            </NextLink>
          </Button>
        </div>
      </div>
    </div>
  );
};
