import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type {
  LegacyMultiSelectOption,
  LegacySingleSelectOption,
} from '../types';

import { OptionList } from './OptionList';
import type { OptionListProps } from './OptionList';

const user = userEvent.setup();

// Test data:
const expanded = true;
const listboxId = 'test-id';
const selectedValues: string[] = [];

const singleSelectOptions: LegacySingleSelectOption[] = [
  { label: 'Test 1', value: 'test1' },
  { label: 'Test 2', value: 'test2' },
  { label: 'Test 3', value: 'test3' },
];

const multiSelectOptions: LegacyMultiSelectOption[] = [
  { label: 'Test 4', value: 'test4', deleteButtonLabel: 'Delete test 4' },
  { label: 'Test 5', value: 'test5', deleteButtonLabel: 'Delete test 5' },
];

const specificPropKeys = ['Single', 'Multiple'] as const;
const specificProps: Record<
  (typeof specificPropKeys)[number],
  Pick<OptionListProps, 'options' | 'multiple'>
> = {
  Single: {
    options: singleSelectOptions,
    multiple: false,
  },
  Multiple: {
    options: multiSelectOptions,
    multiple: true,
  },
};

const defaultProps: OptionListProps = {
  expanded,
  listboxId,
  multiple: false,
  onOptionClick: jest.fn(),
  optionId: jest.fn(),
  options: singleSelectOptions,
  selectedValues,
  setFloating: jest.fn(),
  x: 0,
  y: 0,
  portal: true,
};

describe('OptionList', () => {
  describe.each(specificPropKeys)('%s select', (key) => {
    it('Renders all options', () => {
      render(specificProps[key]);
      const expectedLength = specificProps[key].options.length;
      expect(screen.queryAllByRole('option')).toHaveLength(expectedLength);
    });

    it('Renders with given listboxId', () => {
      render(specificProps[key]);
      expect(screen.getByRole('listbox')).toHaveAttribute('id', listboxId);
    });

    it('Sets correct class according to keyboard/mouse navigation', async () => {
      render(specificProps[key]);
      expect(getListboxWrapper()?.classList).not.toContain('usingKeyboard');
      await act(() => user.tab());
      expect(getListboxWrapper()?.classList).toContain('usingKeyboard');
      await act(() => user.click(document.body));
      expect(getListboxWrapper()?.classList).not.toContain('usingKeyboard');
    });

    it('Sets id for each option using the optionId function', () => {
      const optionId = (value: string) => `option-${value}`;
      render({ ...specificProps[key], optionId });
      const options = screen.queryAllByRole('option');
      options.forEach((option, index) => {
        expect(option).toHaveAttribute(
          'id',
          optionId(specificProps[key].options[index].value),
        );
      });
    });
  });
});

const render = (props: Partial<OptionListProps> = {}) =>
  renderRtl(
    <OptionList
      {...defaultProps}
      {...props}
    />,
  );

const getListboxWrapper = () => screen.getByRole('listbox').parentElement;
