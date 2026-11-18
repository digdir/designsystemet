import {
  Fieldset,
  Heading,
  Paragraph,
  Radio,
  useRadioGroup,
} from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import classes from './settings-card.module.css';

export const SettingsCard = () => {
  const { t } = useTranslation();
  const { getRadioProps } = useRadioGroup({
    name: 'display-mode',
    value: 'datamaskin',
  });

  return (
    <div>
      <Heading data-size='2xs'>{t('examples.settings')}</Heading>
      <Paragraph className={classes.panelDesc}>
        {t('examples.admin-display')}
      </Paragraph>

      <Fieldset data-size='sm' className={classes.radioGroup}>
        <Fieldset.Legend>{t('examples.display-mode')}</Fieldset.Legend>
        <Radio label={t('examples.mobile')} {...getRadioProps('mobil')} />
        <Radio label={t('examples.tablet')} {...getRadioProps('tablet')} />
        <Radio
          label={t('examples.computer')}
          {...getRadioProps('datamaskin')}
        />
        <Radio label={t('examples.tv')} {...getRadioProps('tv')} />
      </Fieldset>
    </div>
  );
};
