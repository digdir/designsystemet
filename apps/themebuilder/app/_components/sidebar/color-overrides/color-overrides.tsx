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
import type { ColorTheme } from '~/routes/themebuilder/_utils/use-themebuilder';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import ColorDetails from './_components/color-details';
import classes from './color-overrides.module.css';


export const ColorOverrides = () => {
  const { colors, severityColors } = useThemebuilder();
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const allColors: ColorTheme[] = [...colors, ...severityColors];

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
            {allColors.map((color) => {
              return <ColorDetails key={color.name} color={color} />;
            })}
          </Card>
        </Dialog.Block>
      </Dialog>
    </>
  );
};
