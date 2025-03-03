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
    value: 'datamaskin',
  });

  return (
    <div>
      <Heading data-size='2xs'>Innstillinger</Heading>
      <Paragraph className={classes.panelDesc}>
        Her kan du administrere visning
      </Paragraph>

      <div className={classes.toggleGroup}>
        <Switch
          data-size='sm'
          description=''
          label='Mørk modus'
          position='start'
          defaultChecked
        />
      </div>

      <Fieldset data-size='sm' className={classes.radioGroup}>
        <Fieldset.Legend>Visnigsmodus</Fieldset.Legend>
        <Radio label='Mobil' {...getRadioProps('mobil')} />
        <Radio label='Tablet' {...getRadioProps('tablet')} />
        <Radio label='Datamaskin' {...getRadioProps('datamaskin')} />
        <Radio label='TV' {...getRadioProps('tv')} />
        <ValidationMessage hidden id=':re:' />
      </Fieldset>
    </div>
  );
};
