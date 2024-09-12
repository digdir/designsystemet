import type { Dispatch, ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';

type ComboboxIdContextType = {
  activeIndex: number;
};

export const ComboboxIdContext = createContext<ComboboxIdContextType>({
  activeIndex: 0,
});

type SetActiveIndexAction = {
  type: 'SET_ACTIVE_INDEX';
  payload: number;
};

type ComboboxIdReducerAction = SetActiveIndexAction;

export const ComboboxIdReducer = (
  state: ComboboxIdContextType,
  action: ComboboxIdReducerAction,
) => {
  switch (action.type) {
    case 'SET_ACTIVE_INDEX':
      return {
        ...state,
        activeIndex: action.payload,
      };
    default:
      return state;
  }
};

export const ComboboxIdDispatch = createContext<
  Dispatch<ComboboxIdReducerAction>
>(() => {
  throw new Error('ComboboxIdDispatch must be used within a provider');
});

export const ComboboxIdProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(ComboboxIdReducer, {
    activeIndex: 0,
  });

  return (
    <ComboboxIdContext.Provider value={state}>
      <ComboboxIdDispatch.Provider value={dispatch}>
        {children}
      </ComboboxIdDispatch.Provider>
    </ComboboxIdContext.Provider>
  );
};

export function useComboboxIdDispatch() {
  return useContext(ComboboxIdDispatch);
}

export function useComboboxId() {
  return useContext(ComboboxIdContext);
}
