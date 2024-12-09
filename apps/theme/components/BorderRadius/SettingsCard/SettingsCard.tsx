import {
  Fieldset,
  Heading,
  Paragraph,
  Radio,
  Switch,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import classes from './SettingsCard.module.css';
export const SettingsCard = () => {
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
          checked
        />
      </div>

      <Fieldset data-size='sm' className={classes.radioGroup}>
        <Fieldset.Legend>Visnigsmodus</Fieldset.Legend>
        <Radio
          ref={function Ms() {}}
          label='Vanilje'
          name='my-group'
          onChange={function Ms() {}}
          value='vanilje'
          checked
        />
        <Radio
          ref={function Ms() {}}
          label='Jordbær'
          name='my-group'
          onChange={function Ms() {}}
          value='jordbær'
        />

        <ValidationMessage hidden id=':re:' />
      </Fieldset>
    </div>
  );
};
