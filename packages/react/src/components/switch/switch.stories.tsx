import preview from '../../../../../apps/storybook/.storybook/preview';

import { Fieldset } from '../fieldset';

import { Switch } from './switch';

const meta = preview.meta({
  title: 'Komponenter/Switch',
  component: Switch,
});

export const Preview = meta.story({
  args: {
    label: 'Switch',
    description: '',
    disabled: false,
    readOnly: false,
    position: 'start',
  },
});

export const Checked = meta.story({
  render: (args) => <Switch {...args} />,
  args: { label: 'Switch', checked: true },
});

export const Group = meta.story({
  render: () => (
    <Fieldset>
      <Fieldset.Legend>Skru av/på lys</Fieldset.Legend>
      <Switch label='Stue' checked />
      <Switch label='Kjøkken' />
      <Switch label='Bad' />
      <Switch
        label='Soverom'
        description='Får ikke kontakt med lyspærene'
        readOnly
      />
    </Fieldset>
  ),
});

export const RightAligned = meta.story({
  args: {
    label: 'Flymodus',
    position: 'end',
    checked: true,
  },
});

export const Outline = meta.story(() => (
  <>
    <Fieldset>
      <Fieldset.Legend>Using variant="outline"</Fieldset.Legend>
      <Switch
        variant='outline'
        label='with description'
        description='description text'
        value='description'
      />
      <Switch variant='outline' label='Checked' value='checked' checked />
      <Switch variant='outline' disabled label='disabled' value='disabled' />
      <Switch
        variant='outline'
        readOnly
        label='readonly checked'
        value='readonly'
        checked
      />
    </Fieldset>
  </>
));
