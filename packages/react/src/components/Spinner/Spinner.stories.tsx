import type { Meta, StoryFn } from '@storybook/react';

import { Spinner } from '.';
import themeConfig from '../../../../theme/configs/designsystemet.config.json';

type Story = StoryFn<typeof Spinner>;

export default {
  title: 'Komponenter/Loaders/Spinner',
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

const colorVariants = [
  ...Object.keys(themeConfig.themes.designsystemet.colors.main),
  ...Object.keys(themeConfig.themes.designsystemet.colors.support),
  'neutral',
];

export const Preview: Story = (args) => <Spinner {...args} />;

Preview.args = {
  'aria-label': 'Henter kaffi',
};

export const Variants: Story = () => (
  <>
    {colorVariants.map((color) => (
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
