import {
  Fieldset,
  Heading,
  Paragraph,
  Radio,
  Switch,
  ValidationMessage,
  useRadioGroup,
} from '@digdir/designsystemet-react';
import classes from './SettingsCard.module.css';
export const SettingsCard = () => {
  const { getRadioProps } = useRadioGroup({
    name: 'my-group',
    value: 'sjokolade',
  });

  return (
    <div>
      <Heading data-size='2xs'>Innstillinger</Heading>
      <Paragraph className={classes.panelDesc}>
        Her kan du administrere brukerene{' '}
      </Paragraph>

      <div className={classes.toggleGroup}>
        <div>
          <Heading className={classes.toggleHeading}>Visning</Heading>
          <Paragraph className={classes.toggleDesc}>
            Her kan du administrere
          </Paragraph>
        </div>
        <Switch
          data-size='sm'
          description=''
          label=''
          position='start'
          defaultChecked
        />
      </div>

      <Fieldset data-size='sm' className={classes.radioGroup}>
        <Fieldset.Legend>Visnigsmodus</Fieldset.Legend>
        <Radio label='Vanilje' {...getRadioProps('vanilje')} />
        <Radio label='Jordbær' {...getRadioProps('jordbær')} />
        <Radio label='Sjokolade' {...getRadioProps('sjokolade')} />
        <Radio
          label='Jeg spiser ikke iskrem'
          {...getRadioProps('spiser-ikke-is')}
        />
        <ValidationMessage hidden id=':re:' />
      </Fieldset>
    </div>
  );
};
