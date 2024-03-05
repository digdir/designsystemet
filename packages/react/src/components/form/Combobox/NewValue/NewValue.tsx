import { useContext, forwardRef } from 'react';
import { PlusIcon } from '@navikt/aksel-icons';
import cl from 'clsx';

import type { ComboboxCustomProps } from '../Custom/Custom';
import ComboboxCustom from '../Custom/Custom';
import { ComboboxContext } from '../Combobox';
import { Button } from '../../../Button';

import classes from './NewValue.module.css';

export const ComboboxNewValueId = 'combobox-new-value';

export type ComboboxNewValueProps = {
  /**
   * Callback for when a new value wants to be added
   */
  onNewValueAdd: (vlaue: string) => void;

  /**
   * Change rendered text
   */
} & Omit<ComboboxCustomProps, 'interactive' | 'onSelect' | 'asChild'>;

export const ComboboxNewValue = forwardRef<
  HTMLDivElement,
  ComboboxNewValueProps
>(({ onNewValueAdd, className, ...props }, ref) => {
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
          interactive
          id={ComboboxNewValueId}
          onSelect={() => onNewValueAdd(inputValue)}
          className={cl(classes.newValue, className)}
          asChild
          {...props}
        >
          <Button
            variant='secondary'
            onClick={() => onNewValueAdd(inputValue)}
            className={classes.button}
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
