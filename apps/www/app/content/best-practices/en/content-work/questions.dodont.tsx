import { Fieldset, Radio, Textfield } from '@digdir/designsystemet-react';

export const DoLabelEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>
        Have you applied for housing benefit before?
      </Fieldset.Legend>
      <Radio label='Yes, I have applied before' value='yes' name='meeting' />
      <Radio label='No, I have not applied before' value='no' name='meeting' />
      <Radio label='I am not sure' value='not-sure' name='meeting' />
    </Fieldset>
  );
};

export const DoFormEn = () => {
  return (
    <Fieldset>
      <Textfield label='Name' />
      <Textfield
        label='Choose a time'
        type='time'
        style={{ maxWidth: '8rem' }}
      />
      <Textfield label='What do you need help with?' multiline rows={4} />
    </Fieldset>
  );
};

export const DontFormEn = () => {
  return (
    <Fieldset>
      <Textfield label='What is your name?' />
      <Textfield label='What time of day works for you?' type='time' />
      <Textfield label='Scope' multiline rows={4} />
    </Fieldset>
  );
};

export const DoClosedEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Do you own the home you live in?</Fieldset.Legend>
      <Radio label='Yes, I own the home' value='yes' />
      <Radio label='No, I rent' value='no-rent' />
      <Radio label='No, I live with someone else' value='no-live' />
    </Fieldset>
  );
};

export const DontOpenEn = () => {
  return <Textfield label='Describe your housing situation' />;
};

export const DoNegationsEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Do you have a place to live?</Fieldset.Legend>
      <Radio label='Yes' value='yes' />
      <Radio label='No' value='no' />
    </Fieldset>
  );
};

export const DontNegationsEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Do you not have a place to live?</Fieldset.Legend>
      <Radio label='Yes' value='yes' />
      <Radio label='No' value='no' />
    </Fieldset>
  );
};

export const DoPlaceholderEn = () => {
  return (
    <Textfield
      label='Department code'
      description='Must be 6 digits. You can find it on your payslip.'
    />
  );
};
export const DontPlaceholderEn = () => {
  return (
    <Textfield
      label='Department code'
      placeholder='6 digits'
      style={{ minWidth: '24rem' }}
    />
  );
};
