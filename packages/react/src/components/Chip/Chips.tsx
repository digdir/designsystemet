import { Slot, Slottable } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

type ChipBaseProps = {
  /**
   * Size
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
};

export type ChipRemovableProps = ChipButtonProps;
export type ChipRadioProps = ChipCheckboxProps;
export type ChipButtonProps = ChipBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement>;
export type ChipCheckboxProps = ChipBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;

/**
 * Chip.Button used for interaction
 * @example
 * <Chip.Button>Click me</Chip.Button>
 */
export const ChipButton = forwardRef<HTMLButtonElement, ChipButtonProps>(
  function ChipButton({ asChild, className, size, ...rest }, ref) {
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        className={cl('ds-chip', className)}
        data-size={size}
        type={asChild ? undefined : 'button'}
        ref={ref}
        {...rest}
      />
    );
  },
);

/**
 * Chip.Removable used for interaction
 * @example
 * <Chip.Removable>Click to remove me</Chip.Removable>
 */
export const ChipRemovable = forwardRef<HTMLButtonElement, ChipRemovableProps>(
  function ChipRemovable(props, ref) {
    return <ChipButton data-removable ref={ref} {...props}></ChipButton>;
  },
);

/**
 * Chip.Checkbox used for multiselection
 * @example
 * <Chip.Checkbox name="language" value="nynorsk">Nynorsk</Chip.Checkbox>
 * <Chip.Checkbox name="language" value="bokmål">Bokmål</Chip.Checkbox>
 */
export const ChipCheckbox = forwardRef<HTMLLabelElement, ChipCheckboxProps>(
  function ChipCheckbox({ asChild, children, className, size, ...rest }, ref) {
    const inputType = (rest as { type?: string }).type ?? 'checkbox';
    const Component = asChild ? Slot : 'label';

    return (
      <Component
        className={cl('ds-chip', className)}
        data-size={size}
        ref={ref}
      >
        <input {...rest} type={inputType} />
        <Slottable>{children}</Slottable>
      </Component>
    );
  },
);

/**
 * Chip.Radio used for single selection
 * @example
 * <Chip.Radio name="language" value="nynorsk">Nynorsk</Chip.Radio>
 * <Chip.Radio name="language" value="bokmål">Bokmål</Chip.Radio>
 */
export const ChipRadio = forwardRef<HTMLLabelElement, ChipRadioProps>(
  function ChipRadio(props, ref) {
    return <ChipCheckbox {...{ ref, type: 'radio', ...props }} />;
  },
);
