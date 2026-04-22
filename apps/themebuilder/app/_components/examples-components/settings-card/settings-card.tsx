import {
  Fieldset,
  Heading,
  Paragraph,
  Radio,
  useRadioGroup,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import classes from './settings-card.module.css';
export const SettingsCard = () => {
  const { t } = useTranslation();
  const { getRadioProps } = useRadioGroup({
    name: 'my-group',
    value: 'datamaskin',
  });

  return (
    <div>
      <Heading data-size='2xs'>{t('overview.settings')}</Heading>
      <Paragraph className={classes.panelDesc}>
        {t('overview.admin-display')}
      </Paragraph>

      <Fieldset data-size='sm' className={classes.radioGroup}>
        <Fieldset.Legend>{t('overview.display-mode')}</Fieldset.Legend>
        <Radio label={t('overview.mobile')} {...getRadioProps('mobil')} />
        <Radio label={t('overview.tablet')} {...getRadioProps('tablet')} />
        <Radio
          label={t('overview.computer')}
          {...getRadioProps('datamaskin')}
        />
        <Radio label={t('overview.tv')} {...getRadioProps('tv')} />
        <ValidationMessage hidden id=':re:' />
      </Fieldset>
    </div>
  );
};
