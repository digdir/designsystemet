import type { ComboboxAction, ComboboxState } from './ComboboxReducer';
import { comboboxReducer } from './ComboboxReducer';

// Test data:
const state: ComboboxState = {
  activeIndex: null,
  inputValue: '',
  isOpen: false,
};

describe('ComboboxReducer', () => {
  describe('openOrClose', () => {
    it.each([true, false])('Sets isOpen to open when %s', (open) => {
      const action: ComboboxAction = {
        type: 'openOrClose',
        open,
      };
      const newState = comboboxReducer(state, action);
      expect(newState.isOpen).toBe(open);
    });
  });

  describe('changeInputValue', () => {
    it('Sets inputValue to the given value', () => {
      const inputValue = 'Lorem ipsum';
      const action: ComboboxAction = {
        type: 'changeInputValue',
        inputValue,
      };
      const newState = comboboxReducer(state, action);
      expect(newState.inputValue).toBe(inputValue);
    });

    it('Sets isOpen to true when the new value is not empty', () => {
      const action: ComboboxAction = {
        type: 'changeInputValue',
        inputValue: 'Lorem ipsum',
      };
      const newState = comboboxReducer(state, action);
      expect(newState.isOpen).toBe(true);
    });

    it('Sets isOpen to false when the new value is empty', () => {
      const prevState: ComboboxState = {
        ...state,
        isOpen: true,
      };
      const action: ComboboxAction = {
        type: 'changeInputValue',
        inputValue: '',
      };
      const newState = comboboxReducer(prevState, action);
      expect(newState.isOpen).toBe(false);
    });
  });

  describe('setActiveIndex', () => {
    it('Sets activeIndex to the given value', () => {
      const activeIndex = 1;
      const action: ComboboxAction = {
        type: 'setActiveIndex',
        activeIndex,
      };
      const newState = comboboxReducer(state, action);
      expect(newState.activeIndex).toBe(activeIndex);
    });
  });

  describe('select', () => {
    it('Sets inputValue to the given value', () => {
      const value = 'Lorem ipsum';
      const action: ComboboxAction = {
        type: 'select',
        value,
      };
      const newState = comboboxReducer(state, action);
      expect(newState.inputValue).toBe(value);
    });

    it('Sets isOpen to false', () => {
      const prevState: ComboboxState = {
        ...state,
        isOpen: true,
      };
      const action: ComboboxAction = {
        type: 'select',
        value: 'Lorem ipsum',
      };
      const newState = comboboxReducer(prevState, action);
      expect(newState.isOpen).toBe(false);
    });
  });
});
