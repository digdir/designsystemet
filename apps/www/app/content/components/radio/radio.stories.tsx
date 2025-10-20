import { Fieldset, Radio } from '@digdir/designsystemet-react';

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
