import type { Meta, StoryFn } from '@storybook/react-vite';
import { severityColors, themeColors } from '../../../stories/constants';

import { Spinner } from './spinner';

type Story = StoryFn<typeof Spinner>;

export default {
  title: 'Komponenter/Spinner',
  component: Spinner,
  parameters: {
    customStyles: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
} as Meta;

export const Preview: Story = (args) => <Spinner {...args} />;

Preview.args = {
  'aria-label': 'Henter kaffi',
};

export const Variants: Story = () => (
  <>
    {[...themeColors, ...severityColors].map((color) => (
      <Spinner
        key={color}
        aria-label={`Henter ${color} kaffi`}
        data-color={color}
        data-size='xl'
      />
    ))}
  </>
);

export const Sizes: Story = (args) => (
  <>
    <Spinner aria-label='Henter kaffi' {...args} data-size='2xs' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='xs' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='sm' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='md' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='lg' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='xl' />
  </>
);
