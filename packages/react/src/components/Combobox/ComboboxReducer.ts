import type { Reducer } from 'react';

export type ComboboxState = {
  isOpen: boolean;
  inputValue: string;
  activeIndex: number | null;
};

export type ComboboxActionType =
  | 'openOrClose'
  | 'changeInputValue'
  | 'setActiveIndex'
  | 'select';

type OpenOrCloseAction = {
  type: 'openOrClose';
  open: boolean;
};

type ChangeInputValueAction = {
  type: 'changeInputValue';
  inputValue: string;
};

type SetActiveIndexAction = {
  type: 'setActiveIndex';
  activeIndex: number | null;
};

type SelectAction = {
  type: 'select';
  value: string;
};

export type ComboboxAction =
  | OpenOrCloseAction
  | ChangeInputValueAction
  | SetActiveIndexAction
  | SelectAction;

type ComboboxReducer<A extends { type: ComboboxActionType }> = (
  state: ComboboxState,
  action: A,
) => ComboboxState;

const openOrClose: ComboboxReducer<OpenOrCloseAction> = (state, { open }) => ({
  ...state,
  isOpen: open,
});

const changeInputValue: ComboboxReducer<ChangeInputValueAction> = (
  state,
  { inputValue },
) => ({
  ...state,
  inputValue,
  activeIndex: 0,
  isOpen: inputValue.length > 0,
  selectedValue: null,
});

const setActiveIndex: ComboboxReducer<SetActiveIndexAction> = (
  state,
  { activeIndex },
) => ({
  ...state,
  activeIndex,
});

const select: ComboboxReducer<SelectAction> = (state, { value }) => ({
  ...state,
  isOpen: false,
  inputValue: value,
});

export const comboboxReducer: Reducer<ComboboxState, ComboboxAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'openOrClose':
      return openOrClose(state, action);
    case 'changeInputValue':
      return changeInputValue(state, action);
    case 'setActiveIndex':
      return setActiveIndex(state, action);
    case 'select':
      return select(state, action);
    default:
      return state;
  }
};
