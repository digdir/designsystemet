import type { Meta, StoryFn } from '@storybook/react-vite';

import { Chip } from './';

export default {
  title: 'Komponenter/Chip',
  component: Chip.Radio,
  parameters: {
    customStyles: { display: 'flex', gap: 'var(--ds-size-2)' },
  },
} satisfies Meta;

export const Preview: StoryFn<typeof Chip.Radio> = (args) => (
  <>
    <Chip.Radio {...args} name='my-radio' value='nynorsk' defaultChecked>
      Nynorsk
    </Chip.Radio>
    <Chip.Radio {...args} name='my-radio' value='bokmål'>
      Bokmål
    </Chip.Radio>
  </>
);

export const Checkbox: StoryFn<typeof Chip.Checkbox> = (args) => (
  <Chip.Checkbox {...args}>Nynorsk</Chip.Checkbox>
);

export const Removable: StoryFn<typeof Chip.Removable> = (args) => (
  <Chip.Removable {...args}>Norge</Chip.Removable>
);

Removable.args = {
  'aria-label': 'Slett Norge',
};

export const Button: StoryFn<typeof Chip.Button> = (args) => (
  <>
    <Chip.Button {...args}>Tøm alle filtre</Chip.Button>
  </>
);

Button.parameters = {
  customStyles: {
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
};

export const Nowrap: StoryFn<typeof Chip.Radio> = () => (
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
);

Nowrap.parameters = {
  layout: 'padded',
};

export const Wrap: StoryFn<typeof Chip.Radio> = () => (
  <>
    <Chip.Radio data-wrap='wrap' name='my-radio' value='nynorsk' defaultChecked>
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
);

Wrap.parameters = {
  layout: 'padded',
};
