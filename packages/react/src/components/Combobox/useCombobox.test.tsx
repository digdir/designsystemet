import React from 'react';
import { renderHook } from '@testing-library/react';

import type { UseComboboxProps } from './useCombobox';
import useCombobox from './useCombobox';

import { Combobox } from '.';

const CHILDREN = [
  <Combobox.Item
    key='1'
    value='leikanger'
  >
    Leikanger
  </Combobox.Item>,
  <Combobox.Item
    key='2'
    value='oslo'
  >
    Oslo
  </Combobox.Item>,
  <Combobox.Item
    key='3'
    value='bronnoysund'
  >
    Brønnøysund
  </Combobox.Item>,
  <Combobox.Empty key='4'>No items</Combobox.Empty>,
];

const FILTER = (inputValue: string, label: string) => {
  return label.toLowerCase().startsWith(inputValue.toLowerCase());
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
      input: '',
      multiple: false,
      activeValues: [],
    });

    expect(result.current.open).toBe(false);
    expect(result.current.values.size).toBe(3);
    expect(result.current.filteredItems.length).toBe(3);
    expect(result.current.restChildren.length).toBe(1);
    expect(result.current.showEmptyChild).toBe(false);
  });

  it('should show empty when we type "3"', () => {
    const { result } = renderUseCombobox({
      input: '3',
      multiple: false,
      activeValues: [],
    });

    expect(result.current.values.size).toBe(3);
    expect(result.current.filteredItems.length).toBe(0);
    expect(result.current.restChildren.length).toBe(1);
    expect(result.current.showEmptyChild).toBe(true);
  });

  it('should show empty when we type "3" and have active value "oslo"', () => {
    const { result } = renderUseCombobox({
      input: '3',
      multiple: false,
      activeValues: [
        {
          value: 'oslo',
          label: 'Oslo',
        },
      ],
    });

    expect(result.current.values.size).toBe(3);
    expect(result.current.filteredItems.length).toBe(0);
    expect(result.current.restChildren.length).toBe(1);
    expect(result.current.showEmptyChild).toBe(true);
  });

  it('should show empty when we type "3" and have active value "oslo" and multiple', () => {
    const { result } = renderUseCombobox({
      input: '3',
      multiple: true,
      activeValues: [
        {
          value: 'oslo',
          label: 'Oslo',
        },
      ],
    });

    expect(result.current.values.size).toBe(3);
    expect(result.current.filteredItems.length).toBe(0);
    expect(result.current.restChildren.length).toBe(1);
    expect(result.current.showEmptyChild).toBe(true);
  });

  it('should show 1 item when we type "l"', () => {
    const { result } = renderUseCombobox({
      input: 'l',
      multiple: false,
      activeValues: [],
    });

    expect(result.current.values.size).toBe(3);
    expect(result.current.filteredItems.length).toBe(1);
    expect(result.current.restChildren.length).toBe(1);
    expect(result.current.showEmptyChild).toBe(false);
  });

  it('should show 1 item when we type "l" and have active value "oslo"', () => {
    const { result } = renderUseCombobox({
      input: 'l',
      multiple: false,
      activeValues: [
        {
          value: 'oslo',
          label: 'Oslo',
        },
      ],
    });

    expect(result.current.values.size).toBe(3);
    expect(result.current.filteredItems.length).toBe(1);
    expect(result.current.restChildren.length).toBe(1);
    expect(result.current.showEmptyChild).toBe(false);
  });
});
