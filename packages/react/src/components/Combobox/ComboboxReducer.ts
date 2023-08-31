import type { Reducer } from 'react';

export type ComboboxState = {
  isOpen: boolean;
  inputValue: string;
  activeIndex: number | null;
};

export enum ComboboxActionType {
  OpenOrClose = 'OPEN_OR_CLOSE',
  ChangeInputValue = 'CHANGE_INPUT_VALUE',
  SetActiveIndex = 'SET_ACTIVE_INDEX',
  Select = 'SELECT',
}

type OpenOrCloseAction = {
  type: ComboboxActionType.OpenOrClose;
  open: boolean;
};

type ChangeInputValueAction = {
  type: ComboboxActionType.ChangeInputValue;
  inputValue: string;
};

type SetActiveIndexAction = {
  type: ComboboxActionType.SetActiveIndex;
  activeIndex: number | null;
};

type SelectAction = {
  type: ComboboxActionType.Select;
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
    case ComboboxActionType.OpenOrClose:
      return openOrClose(state, action);
    case ComboboxActionType.ChangeInputValue:
      return changeInputValue(state, action);
    case ComboboxActionType.SetActiveIndex:
      return setActiveIndex(state, action);
    case ComboboxActionType.Select:
      return select(state, action);
    default:
      return state;
  }
};
