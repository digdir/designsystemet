import type { Meta } from '@storybook/react';
import { Checkbox } from '../..';
import type { UseCheckboxGroupProps } from './useCheckboxGroup';

export const UseCheckboxGroup = (_props: UseCheckboxGroupProps) => (
  <Checkbox aria-label='label' value='' />
);

export default {
  title: 'Komponenter/Checkbox/useCheckboxGroup',
  tags: ['!dev'], // Hide from sidebar as documented in https://storybook.js.org/docs/writing-stories/tags
  component: UseCheckboxGroup,
  argTypes: {
    name: {
      table: { type: { summary: 'string' } },
      description:
        'Name of all checkboxes. If no name is passed, an auto-generated name will be created.',
    },
    value: {
      description: 'Array of values of selected checkboxes',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string[]' },
      },
    },
    onChange: {
      description: 'Callback when selected checkboxes changes',
      table: {
        type: {
          summary:
            '(nextValue: string[], prevValue: string[], event: ChangeEvent<HTMLInputElement>) => void;',
        },
      },
    },
    error: {
      table: { type: { summary: 'string | ReactNode' } },
      description: 'Shared error message for all checkboxes.',
    },
    disabled: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set disabled state of all checkboxes',
    },
    readOnly: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set read only state of all checkboxes',
    },
  },
} as Meta;
