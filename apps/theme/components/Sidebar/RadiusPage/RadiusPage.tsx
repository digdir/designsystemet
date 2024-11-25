import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ChevronLeftIcon, SparklesIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useState } from 'react';
import { useThemeStore } from '../../../store';
import { Toggle } from '../../Toggle/Toggle';
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
      <div className={classes.group}>
        <div>
          <Toggle
            onChange={(value) => {
              if (value === '0px') {
                setBorderRadius('none');
              } else if (value === '4px') {
                setBorderRadius('small');
              } else if (value === '7px') {
                setBorderRadius('medium');
              } else if (value === '10px') {
                setBorderRadius('large');
              } else if (value === '9999px') {
                setBorderRadius('full');
              }
            }}
            type='radius'
            showLabel={true}
            items={[
              { name: 'Ingen', type: 'sm', value: '0px' },
              { name: 'Small', type: 'sm', value: '4px' },
              { name: 'Medium', type: 'sm', value: '7px' },
              { name: 'Large', type: 'sm', value: '10px' },
              { name: 'Full', type: 'sm', value: '9999px' },
            ]}
          />
        </div>
      </div>

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
