import {} from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Fieldset, Radio, ValidationMessage } from '../..';
import type { UseRadioGroupProps } from '../../utilities';

export default {
  title: 'Komponenter/Radio',
  component: Radio,
} as Meta;

export const Preview: StoryObj<typeof Radio> = {
  args: {
    label: 'Radio',
    description: 'Description',
    disabled: false,
    readOnly: false,
    value: 'value',
    name: 'name',
  },
};

export const AriaLabel: StoryObj<typeof Radio> = {
  args: {
    value: 'value',
    'aria-label': 'Radio',
  },
};

export const Group: StoryFn<UseRadioGroupProps> = () => {
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

export const WithError: StoryFn<UseRadioGroupProps> = () => {
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

export const ReadOnly: StoryFn<UseRadioGroupProps> = () => {
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

export const Inline: StoryFn<typeof Fieldset> = () => (
  <Fieldset>
    <Fieldset.Legend>Kontaktes på e-post?</Fieldset.Legend>
    <Fieldset.Description>
      Bekreft om du ønsker å bli kontaktet per e-post.
    </Fieldset.Description>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-size-6)' }}>
      <Radio name='my-inline' label='Ja' value='ja' />
      <Radio name='my-inline' label='Nei' value='nei' />
    </div>
  </Fieldset>
);
