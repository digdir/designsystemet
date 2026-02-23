import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { TokenModal } from '../../token-modal/token-modal';
import classes from './finish-page.module.css';

type FinishPageProps = {
  onPrevClick: () => void;
};

export const FinishPage = ({ onPrevClick }: FinishPageProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Heading data-size='xs'>{t('themeModal.use-theme')}</Heading>
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
            <ChevronLeftIcon aria-hidden />
            Border radius
          </Button>
          <TokenModal />
        </div>
      </div>
    </div>
  );
};
