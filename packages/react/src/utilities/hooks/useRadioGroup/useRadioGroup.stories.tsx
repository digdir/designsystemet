import type { Meta } from '@storybook/react';
import { Radio } from '../../../components';
import type { UseRadioGroupProps } from './useRadioGroup';

export const UseRadioGroup = (_props: UseRadioGroupProps) => (
  <Radio aria-label='label' />
);

export default {
  title: 'Utilities/useRadioGroup',
  tags: ['!dev'], // Hide from sidebar as documented in https://storybook.js.org/docs/writing-stories/tags
  component: UseRadioGroup,
  argTypes: {
    name: {
      table: { type: { summary: 'string' } },
      description:
        'Name of all radios. If no name is passed, an auto-generated name will be created.',
    },
    value: {
      description: 'Value of selected radio',
      table: { defaultValue: { summary: '' }, type: { summary: 'string' } },
    },
    onChange: {
      description: 'Callback when selected radio changes',
      table: {
        type: {
          summary:
            '(nextValue: string, prevValue: string, event: Event) => void;',
        },
      },
    },
    error: {
      table: { type: { summary: 'string | ReactNode' } },
      description: 'Shared error message for all radios.',
    },
    disabled: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set disabled state of all radios',
    },
    readOnly: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set read only state of all radios',
    },
    required: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set required state of all radios',
    },
  },
} as Meta;
