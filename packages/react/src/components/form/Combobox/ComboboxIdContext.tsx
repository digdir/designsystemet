import type { Dispatch } from 'react';
import { createContext, useContext, useReducer } from 'react';

type ComboboxIdContextType = {
  activeIndex: number;
  activeDescendant: string | undefined;
};

export const ComboboxIdContext = createContext<ComboboxIdContextType>({
  activeIndex: 0,
  activeDescendant: undefined,
});

type SetActiveIndexAction = {
  type: 'SET_ACTIVE_INDEX';
  payload: number;
};

type SetActiveDescendantIdAction = {
  type: 'SET_ACTIVE_DESCENDANT';
  payload: string;
};

type ComboboxIdReducerAction =
  | SetActiveIndexAction
  | SetActiveDescendantIdAction;

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
    case 'SET_ACTIVE_DESCENDANT':
      return {
        ...state,
        activeDescendant: action.payload,
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
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ComboboxIdReducer, {
    activeIndex: 0,
    activeDescendant: undefined,
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
