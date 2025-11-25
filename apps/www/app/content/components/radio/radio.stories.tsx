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
