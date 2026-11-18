import {
  Button,
  Card,
  Dialog,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { PencilIcon } from '@navikt/aksel-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '~/model/theme-store';
import { ColorOverrideSection } from './color-override-section';
import classes from './color-overrides-dialog.module.css';

export const ColorOverridesDialog = () => {
  const { colors } = useThemeStore();
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        variant='secondary'
        data-size='sm'
        className={classes.overridesBtn}
        aria-haspopup='dialog'
        onClick={() => dialogRef.current?.showModal()}
      >
        <PencilIcon aria-hidden />
        {t('overrides.open')}
      </Button>
      <Dialog ref={dialogRef} closedby='any' className={classes.dialog}>
        <Dialog.Block>
          <Heading data-size='xs'>{t('overrides.heading')}</Heading>
          <Paragraph data-size='sm' className={classes.description}>
            {t('overrides.description')}
          </Paragraph>
        </Dialog.Block>

        <Dialog.Block>
          <Card data-color='neutral' variant='tinted'>
            {colors.map((color) => (
              <ColorOverrideSection key={color.name} color={color} />
            ))}
          </Card>
        </Dialog.Block>
      </Dialog>
    </>
  );
};
