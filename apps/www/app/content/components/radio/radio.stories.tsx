import {
  Fieldset,
  Radio,
  ValidationMessage,
} from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Radio label='Radio' value='value' name='name' />;
};

export const Group = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Hvordan ønsker du at vi kontakter deg?</Fieldset.Legend>
      <Fieldset.Description>
        Velg metoden som passer best for deg. Vi bruker dette kun til å sende
        viktig informasjon om saken din.
      </Fieldset.Description>
      <Radio
        label='E-post'
        description='Vi bruker e-postadressen du har oppgitt tidligere (navn@epost.no)'
        value='epost'
        name='kontakt'
      />
      <Radio
        label='SMS'
        description='Vi bruker telefonnummeret du har oppgitt tidligere (99 99 99 99)'
        value='sms'
        name='kontakt'
      />
      <Radio
        label='Brev'
        description='Levering kan ta 3–5 virkedager, avhengig av posttjenesten.'
        value='brev'
        name='kontakt'
      />
    </Fieldset>
  );
};

export const GroupEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>How would you like us to contact you?</Fieldset.Legend>
      <Fieldset.Description>
        Choose the method that works best for you. We use this only to send
        important updates about your case.
      </Fieldset.Description>
      <Radio
        label='Email'
        description='We will use the email address you provided earlier (name@example.com)'
        value='email'
        name='contact'
      />
      <Radio
        label='SMS'
        description='We will use the phone number you provided earlier (99 99 99 99)'
        value='sms'
        name='contact'
      />
      <Radio
        label='Letter'
        description='Delivery may take 3–5 working days, depending on the postal service.'
        value='letter'
        name='contact'
      />
    </Fieldset>
  );
};

export const WithError = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Hvilken bydel bor du i?</Fieldset.Legend>
      <Fieldset.Description>
        Trondheim er delt inn i fire bydeler
      </Fieldset.Description>
      <Radio label='Østbyen' value='ostbyen' name='city' aria-invalid='true' />
      <Radio
        label='Lerkendal'
        value='lerkendal'
        name='city'
        aria-invalid='true'
      />
      <Radio label='Heimdal' value='heimdal' name='city' aria-invalid='true' />
      <Radio
        label='Midtbyen'
        value='midtbyen'
        name='city'
        aria-invalid='true'
      />
      <ValidationMessage data-color='danger'>
        Du må velge en bydel før du kan fortsette.
      </ValidationMessage>
    </Fieldset>
  );
};

export const WithErrorEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Which district do you live in?</Fieldset.Legend>
      <Fieldset.Description>
        Trondheim is divided into four districts
      </Fieldset.Description>
      <Radio label='Østbyen' value='ostbyen' name='city' aria-invalid='true' />
      <Radio
        label='Lerkendal'
        value='lerkendal'
        name='city'
        aria-invalid='true'
      />
      <Radio label='Heimdal' value='heimdal' name='city' aria-invalid='true' />
      <Radio
        label='Midtbyen'
        value='midtbyen'
        name='city'
        aria-invalid='true'
      />
      <ValidationMessage data-color='danger'>
        You must choose a district before you can continue.
      </ValidationMessage>
    </Fieldset>
  );
};

export const ReadOnly = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Hvilken bydel bor du i?</Fieldset.Legend>
      <Fieldset.Description>
        Trondheim er delt inn i fire bydeler
      </Fieldset.Description>
      <Radio label='Østbyen' value='ostbyen' name='city' readOnly />
      <Radio label='Lerkendal' value='lerkendal' name='city' readOnly />
      <Radio label='Heimdal' value='heimdal' name='city' readOnly checked />
      <Radio label='Midtbyen' value='midtbyen' name='city' readOnly />
    </Fieldset>
  );
};

export const ReadOnlyEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Which district do you live in?</Fieldset.Legend>
      <Fieldset.Description>
        Trondheim is divided into four districts
      </Fieldset.Description>
      <Radio label='Østbyen' value='ostbyen' name='city' readOnly />
      <Radio label='Lerkendal' value='lerkendal' name='city' readOnly />
      <Radio label='Heimdal' value='heimdal' name='city' readOnly checked />
      <Radio label='Midtbyen' value='midtbyen' name='city' readOnly />
    </Fieldset>
  );
};

export const Inline = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Kontaktes på e-post?</Fieldset.Legend>
      <Fieldset.Description>
        Bekreft om du ønsker å bli kontaktet per e-post.
      </Fieldset.Description>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-size-6)' }}
      >
        <Radio name='my-inline' label='Ja' value='ja' />
        <Radio name='my-inline' label='Nei' value='nei' />
      </div>
    </Fieldset>
  );
};

export const InlineEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Contact by email?</Fieldset.Legend>
      <Fieldset.Description>
        Confirm whether you would like to be contacted by email.
      </Fieldset.Description>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-size-6)' }}
      >
        <Radio name='my-inline' label='Yes' value='yes' />
        <Radio name='my-inline' label='No' value='no' />
      </div>
    </Fieldset>
  );
};
