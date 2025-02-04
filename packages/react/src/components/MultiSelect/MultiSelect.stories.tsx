import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import {} from 'react';
import { EXPERIMENTAL_MultiSelect as MultiSelect } from '.';
import { Field, Label } from '..';

export default {
  title: 'Komponenter/MultiSelect',
  component: MultiSelect,
  /* add height by default */
  decorators: [
    (Story) => (
      <div style={{ height: '300px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    a11y: {
      // TODO: these rules should be enabled after figuring out why they occur.
      // for some reason it says `aria-expanded` is not allowed
      config: {
        rules: [
          {
            id: 'aria-allowed-attr',
            enabled: false,
          },
          /* It does not like role="combobox" either */
          {
            id: 'aria-allowed-role',
            enabled: false,
          },
        ],
      },
    },
  },
  play: async (ctx) => {
    const storyRoot = ctx.canvasElement;
    // Refactored out the play function for easier reuse in the InModal story
    await testMultiSelect(storyRoot);
  },
} as Meta;

async function testMultiSelect(el: HTMLElement) {
  /* When in test mode, open MultiSelect by focusing input */
  const input = within(el).getByRole('combobox');
  await userEvent.click(input);
}

const DATA_PLACES = [
  'Sogndal',
  'Oslo',
  'Stavanger',
  'Brønnøysund',
  'Trondheim',
  'Bergen',
];

export const Preview: StoryFn<typeof MultiSelect> = (args) => {
  return (
    <Field>
      <Label>Velg reisemål du vil besøke</Label>
      <MultiSelect {...args}>
        <MultiSelect.Chips />
        <MultiSelect.Input />
        <MultiSelect.List>
          <MultiSelect.Empty>Tomt</MultiSelect.Empty>
          {DATA_PLACES.map((place) => (
            <MultiSelect.Option key={place} value={place}>
              {place}
              <div>Kommune</div>
            </MultiSelect.Option>
          ))}
        </MultiSelect.List>
      </MultiSelect>
    </Field>
  );
};
