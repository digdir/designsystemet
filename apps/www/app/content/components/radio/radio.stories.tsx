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
      <Fieldset.Legend>Hvilken iskremsmak er best?</Fieldset.Legend>
      <Fieldset.Description>
        Velg din favorittsmak blant alternativene.
      </Fieldset.Description>
      <Radio label='Vanilje' value='vanilje' name='icecream' />
      <Radio
        label='Jordbær'
        description='Jordbær er best'
        value='jordbær'
        name='icecream'
      />
      <Radio label='Sjokolade' value='sjokolade' name='icecream' />
      <Radio
        label='Jeg spiser ikke iskrem'
        value='spiser-ikke-is'
        name='icecream'
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
