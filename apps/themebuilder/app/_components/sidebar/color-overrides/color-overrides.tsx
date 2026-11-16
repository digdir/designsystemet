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
import { useThemebuilder } from '~/_hooks/use-themebuilder';
import ColorDetails from './_components/color-details';
import classes from './color-overrides.module.css';

export const ColorOverrides = () => {
  const { colors } = useThemebuilder();
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
        {t('colorPane.token-overrides')}
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
              <ColorDetails key={color.name} color={color} />
            ))}
          </Card>
        </Dialog.Block>
      </Dialog>
    </>
  );
};
