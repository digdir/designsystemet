import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { TokenModal } from '../../TokenModal/TokenModal';
import classes from './FinishPage.module.css';

type FinishPageProps = {
  onPrevClick: () => void;
};

export const FinishPage = ({ onPrevClick }: FinishPageProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <Heading data-size='xs'>Ta i bruk tema</Heading>
      <Paragraph data-size='sm' className={classes.desc}>
        Logbook a sitting success parents' girl in it however, greater, full
        with he that pleasures up attention to hardly to power definitely hardly
      </Paragraph>

      <Paragraph data-size='sm' className={classes.desc}>
        Logbook a sitting success parents' girl in it however, greater, full
        with he that pleasures up attention to hardly to power definitely hardly
      </Paragraph>

      <Paragraph data-size='sm' className={classes.desc}>
        Logbook a sitting success parents' girl in it however, greater, full
        with he that pleasures up attention to hardly to power definitely hardly
      </Paragraph>

      <div className={classes.bottom}>
        <div className={classes.btnGroup}>
          <Button
            data-size='sm'
            className={classes.btn}
            onClick={() => onPrevClick()}
            variant='secondary'
          >
            <ChevronLeftIcon aria-hidden fontSize='1.5rem' />
            Border radius
          </Button>
          <TokenModal />
        </div>
      </div>
    </div>
  );
};
