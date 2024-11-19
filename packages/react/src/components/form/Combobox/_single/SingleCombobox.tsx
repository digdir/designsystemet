import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import {
  type HTMLAttributes,
  createContext,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import '@u-elements/u-tags';
import type { DefaultProps } from '../../../../types';
import { Popover } from '../../../Popover';
import { setReactInputValue } from '../utilities';

/* I think we can always send a string array */
type ComboboxContextType = {
  listId?: string;
  setListId?: (id: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
};

export const ComboboxContext = createContext<ComboboxContextType>({});

export type ComboboxProps = {
  defaultValue?: string;
  value?: string;
  onChange: (values: string) => void;
} & Omit<HTMLAttributes<HTMLElement>, 'onChange'> &
  DefaultProps;

export const SingleCombobox = forwardRef<HTMLElement, ComboboxProps>(
  function SingleCombobox({ className, defaultValue, onChange, ...rest }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const innerRef = useRef<HTMLElement>(null);
    const mergedRefs = useMergeRefs([innerRef, ref]);

    const [internalValue, setInternalValue] = useState<string>(
      defaultValue || '',
    );

    const randListId = useId();
    const [listId, setListId] = useState(randListId);

    // if we have a default value, update the input value
    useEffect(() => {
      defaultValue && setReactInputValue(inputRef.current, defaultValue);

      return () => {
        console.error('This is a test');
      };
    }, [defaultValue]);

    // Get value the selected option

    return (
      <Popover.Context>
        <ComboboxContext.Provider
          value={{
            listId,
            setListId,
            inputRef,
          }}
        >
          <div
            className={cl('ds-combobox2', className)}
            ref={mergedRefs}
            {...rest}
          />
        </ComboboxContext.Provider>
      </Popover.Context>
    );
  },
);
