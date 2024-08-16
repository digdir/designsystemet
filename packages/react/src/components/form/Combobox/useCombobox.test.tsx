import { renderHook } from '@testing-library/react';

import type { UseComboboxProps } from './useCombobox';
import { useCombobox } from './useCombobox';

import { Combobox } from '.';

const CHILDREN = [
  <Combobox.Option key='1' value='leikanger' displayValue='Leikanger'>
    Leikanger
  </Combobox.Option>,
  <Combobox.Option key='2' value='oslo' displayValue='Oslo'>
    Oslo
  </Combobox.Option>,
  <Combobox.Option key='3' value='bronnoysund' displayValue='Brønnøysund'>
    Brønnøysund
  </Combobox.Option>,
  <Combobox.Empty key='4'>No items</Combobox.Empty>,
];

const FILTER = (
  inputValueValue: string,
  option: {
    value: string;
    label: string;
  },
) => {
  return option.label.toLowerCase().startsWith(inputValueValue.toLowerCase());
};

const renderUseCombobox = ({
  ...args
}: Omit<UseComboboxProps, 'children' | 'filter'>) =>
  renderHook(() =>
    useCombobox({
      ...args,
      children: CHILDREN,
      filter: FILTER,
    }),
  );

describe('useCombobox', () => {
  it('should return the correct values', () => {
    const { result } = renderUseCombobox({
      inputValue: '',
      multiple: false,
    });

    expect(Object.keys(result.current.options).length).toBe(3);
    expect(result.current.filteredOptions.length).toBe(3);
    expect(result.current.restChildren.length).toBe(1);
  });

  it('should show empty when we type "3"', () => {
    const { result } = renderUseCombobox({
      inputValue: '3',
      multiple: false,
    });

    expect(Object.keys(result.current.options).length).toBe(3);
    expect(result.current.filteredOptions.length).toBe(0);
    expect(result.current.restChildren.length).toBe(1);
  });

  it('should show 1 option when we type "3" and have active value "oslo"', () => {
    const { result } = renderUseCombobox({
      inputValue: '3',
      multiple: true,
      initialValue: ['oslo'],
    });

    expect(Object.keys(result.current.options).length).toBe(3);
    expect(result.current.filteredOptions.length).toBe(1);
    expect(result.current.restChildren.length).toBe(1);
  });

  it('should show 1 option when we type "3" and have active value "oslo" and multiple', () => {
    const { result } = renderUseCombobox({
      inputValue: '3',
      multiple: true,
      initialValue: ['oslo'],
    });

    expect(Object.keys(result.current.options).length).toBe(3);
    expect(result.current.filteredOptions.length).toBe(1);
    expect(result.current.restChildren.length).toBe(1);
  });

  it('should show 1 option when we type "l"', () => {
    const { result } = renderUseCombobox({
      inputValue: 'l',
      multiple: false,
    });

    expect(Object.keys(result.current.options).length).toBe(3);
    expect(result.current.filteredOptions.length).toBe(1);
    expect(result.current.restChildren.length).toBe(1);
  });

  it('should show 2 option when we type "l" and have active value "oslo"', () => {
    const { result } = renderUseCombobox({
      inputValue: 'l',
      multiple: true,
      initialValue: ['oslo'],
    });

    expect(Object.keys(result.current.options).length).toBe(3);
    expect(result.current.filteredOptions.length).toBe(2);
    expect(result.current.restChildren.length).toBe(1);
  });
});
