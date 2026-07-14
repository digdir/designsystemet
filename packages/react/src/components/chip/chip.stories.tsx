import preview from '../../../../../apps/storybook/.storybook/preview';

import { Chip, type ChipButtonProps, type ChipRemovableProps } from './';

const meta = preview.meta({
  title: 'Komponenter/Chip',
  component: Chip.Radio,
  parameters: {
    customStyles: { display: 'flex', gap: 'var(--ds-size-2)' },
  },
});

export const Preview = meta.story({
  render: (args) => (
    <>
      <Chip.Radio {...args} name='my-radio' value='nynorsk' defaultChecked>
        Nynorsk
      </Chip.Radio>
      <Chip.Radio {...args} name='my-radio' value='bokmål'>
        Bokmål
      </Chip.Radio>
    </>
  ),
});

export const Checkbox = meta.story({
  render: (args) => <Chip.Checkbox {...args}>Nynorsk</Chip.Checkbox>,
});

export const Removable = meta.story({
  render: (args) => (
    <Chip.Removable {...(args as ChipRemovableProps)}>Norge</Chip.Removable>
  ),

  args: {
    'aria-label': 'Slett Norge',
  },
});

export const Button = meta.story({
  render: (args) => (
    <Chip.Button {...(args as ChipButtonProps)}>Tøm alle filtre</Chip.Button>
  ),

  parameters: {
    customStyles: {
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
});

export const Nowrap = meta.story({
  render: () => (
    <>
      <Chip.Radio name='my-radio' value='nynorsk' defaultChecked>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in
        lobortis eros. Aenean id tellus molestie, semper massa non, ultricies
        sapien.
      </Chip.Radio>
      <Chip.Checkbox name='my-checkbox' value='nynorsk' defaultChecked>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in
        lobortis eros. Aenean id tellus molestie, semper massa non, ultricies
        sapien.
      </Chip.Checkbox>
      <Chip.Removable>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in
        lobortis eros. Aenean id tellus molestie, semper massa non, ultricies
        sapien.
      </Chip.Removable>
      <Chip.Button>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in
        lobortis eros. Aenean id tellus molestie, semper massa non, ultricies
        sapien.
      </Chip.Button>
    </>
  ),

  parameters: {
    layout: 'padded',
  },
});

export const Wrap = meta.story({
  render: () => (
    <>
      <Chip.Radio
        data-wrap='wrap'
        name='my-radio'
        value='nynorsk'
        defaultChecked
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in
        lobortis eros. Aenean id tellus molestie, semper massa non, ultricies
        sapien.
      </Chip.Radio>
      <Chip.Checkbox
        data-wrap='wrap'
        name='my-checkbox'
        value='nynorsk'
        defaultChecked
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in
        lobortis eros. Aenean id tellus molestie, semper massa non, ultricies
        sapien.
      </Chip.Checkbox>
      <Chip.Removable data-wrap='wrap'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in
        lobortis eros. Aenean id tellus molestie, semper massa non, ultricies
        sapien.
      </Chip.Removable>
      <Chip.Button data-wrap='wrap'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in
        lobortis eros. Aenean id tellus molestie, semper massa non, ultricies
        sapien.
      </Chip.Button>
    </>
  ),

  parameters: {
    layout: 'padded',
  },
});
