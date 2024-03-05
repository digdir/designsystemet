import { useContext, forwardRef } from 'react';
import { PlusIcon } from '@navikt/aksel-icons';

import type { ComboboxCustomProps } from '../Custom/Custom';
import ComboboxCustom from '../Custom/Custom';
import { ComboboxContext } from '../Combobox';
import { Button } from '../../../Button';

export type ComboboxNewValueProps = {
  /**
   * Callback for when a new value wants to be added
   */
  onNewValueAdd: (vlaue: string) => void;

  /**
   * Change rendered text
   */
} & ComboboxCustomProps;

export const ComboboxNewValue = forwardRef<
  HTMLDivElement,
  ComboboxNewValueProps
>(({ onNewValueAdd, ...props }, ref) => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { inputValue, options } = context;

  const showAddNew =
    inputValue &&
    !options.some((option) => option.value === inputValue.toLowerCase());

  return (
    <>
      {showAddNew && (
        <ComboboxCustom
          ref={ref}
          asChild
          interactive
          id='combobox-add-new-option'
          onSelect={() => onNewValueAdd(inputValue)}
          {...props}
        >
          <Button
            variant='secondary'
            onClick={() => onNewValueAdd(inputValue)}
            style={{
              width: '100%',
            }}
          >
            <PlusIcon
              title='plus'
              fontSize='1.5rem'
            />
            Legg til &quot;{inputValue}&quot;
          </Button>
        </ComboboxCustom>
      )}
    </>
  );
});

ComboboxNewValue.displayName = 'Combobox.NewValue';
