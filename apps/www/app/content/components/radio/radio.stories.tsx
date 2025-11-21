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
      <Fieldset.Legend>Hvor reiste du fra?</Fieldset.Legend>
      <Fieldset.Description>
        Vi bruker dette for å regne ut distanse til din reiseregning.
      </Fieldset.Description>
      <Radio label='Sogndal (SOG)' value='sogndal' name='reise' />
      <Radio
        label='Oslo (OSL)'
        description='Velg denne selv om du reiste fra en annen flyplass i Oslo-området'
        value='oslo'
        name='reise'
      />
      <Radio label='Trondheim (TRD)' value='trondheim' name='reise' />
      <Radio label='Jeg tok ikke fly' value='tok-ikke-fly' name='reise' />
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
