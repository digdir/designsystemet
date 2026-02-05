import { Fieldset, Paragraph, Radio } from '@digdir/designsystemet-react';

export const DoIcon = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Ønsker du et møte?</Fieldset.Legend>
      <Fieldset.Description>
        Du kan få et møte med oss der vi forklarer innholdet i vedtaket.
      </Fieldset.Description>
      <Radio label='Ja' value='ja' name='meeting' />
      <Radio label='Nei' value='nei' name='meeting' />
    </Fieldset>
  );
};

export const DontIcon = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Ønsker du et møte?</Fieldset.Legend>
      <Radio label='Ja' value='ja' name='meeting-dont' />
      <Radio label='Nei' value='nei' name='meeting-dont' />
      <Paragraph>
        Du kan få et møte med oss der vi forklarer innholdet i vedtaket.
      </Paragraph>
    </Fieldset>
  );
};

export const DoIconEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Would you like a meeting?</Fieldset.Legend>
      <Fieldset.Description>
        You can request a meeting with us where we explain the contents of the
        decision.
      </Fieldset.Description>
      <Radio label='Yes' value='yes' name='meeting' />
      <Radio label='No' value='no' name='meeting' />
    </Fieldset>
  );
};

export const DontIconEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Would you like a meeting?</Fieldset.Legend>
      <Radio label='Yes' value='yes' name='meeting-dont' />
      <Radio label='No' value='no' name='meeting-dont' />
      <Paragraph>
        You can request a meeting with us where we explain the contents of the
        decision.
      </Paragraph>
    </Fieldset>
  );
};
