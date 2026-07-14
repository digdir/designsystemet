import preview from '../../../../../apps/storybook/.storybook/preview';
import { severityColors, themeColors } from '../../../stories/constants';

import { Spinner } from './spinner';

const meta = preview.meta({
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
});

export const Preview = meta.story({
  args: {
    'aria-label': 'Henter kaffi',
  },
});

export const Variants = meta.story(() => (
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
));

export const Sizes = meta.story({
  args: {
    'aria-label': 'Henter kaffi',
  },
  render: (args) => (
    <>
      <Spinner {...args} data-size='2xs' />
      <Spinner {...args} data-size='xs' />
      <Spinner {...args} data-size='sm' />
      <Spinner {...args} data-size='md' />
      <Spinner {...args} data-size='lg' />
      <Spinner {...args} data-size='xl' />
    </>
  ),
});
