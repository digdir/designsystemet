import { Fieldset, Radio, Textfield } from '@digdir/designsystemet-react';

export const DoLabel = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Har du søkt om bostøtte før?</Fieldset.Legend>
      <Radio label='Ja, jeg har søkt før' value='yes' name='meeting' />
      <Radio label='Nei, jeg har ikke søkt før' value='no' name='meeting' />
      <Radio label='Jeg er ikke sikker' value='not-sure' name='meeting' />
    </Fieldset>
  );
};

export const DoForm = () => {
  return (
    <Fieldset>
      <Textfield label='Navn' />
      <Textfield
        label='Velg tidspunkt'
        type='time'
        style={{ maxWidth: '8rem' }}
      />
      <Textfield label='Hva trenger du hjelp til?' multiline rows={4} />
    </Fieldset>
  );
};
export const DontForm = () => {
  return (
    <Fieldset>
      <Textfield label='Hva er navnet ditt?' />
      <Textfield label='Når på døgnet passer det?' type='time' />
      <Textfield label='Omfang' multiline rows={4} />
    </Fieldset>
  );
};

export const DoClosed = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Eier du boligen du bor i?</Fieldset.Legend>
      <Radio label='Ja, jeg eier boligen' value='yes' />
      <Radio label='Nei, jeg leier' value='no-rent' />
      <Radio label='Nei, jeg bor hos noen' value='no-live' />
    </Fieldset>
  );
};
export const DontOpen = () => {
  return <Textfield label='Beskriv din boligsituasjon' />;
};

export const DoNegations = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Har du et sted å bo?</Fieldset.Legend>
      <Radio label='Ja' value='yes' />
      <Radio label='Nei' value='no' />
    </Fieldset>
  );
};
export const DontNegations = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Har du ikke et sted å bo?</Fieldset.Legend>
      <Radio label='Ja' value='yes' />
      <Radio label='Nei' value='no' />
    </Fieldset>
  );
};

export const DoPlaceholder = () => {
  return (
    <Textfield
      label='Avdelingskode'
      description='Skal være 6 siffer, kan finnes på lønnslippen din'
    />
  );
};

export const DontPlaceholder = () => {
  return (
    <Textfield
      label='Avdelingskode'
      placeholder='6 siffer'
      style={{ minWidth: '24rem' }}
    />
  );
};
