import { Slot, Slottable } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type {
  ButtonHTMLAttributes,
  ForwardedRef,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from 'react';
import { Paragraph } from '../Typography';

type Button = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;
type Label = LabelHTMLAttributes<HTMLLabelElement> & {
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
};
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

export type ChipButtonProps = ChipBaseProps & Button;
export type ChipRemovableProps = ChipBaseProps & Button;
export type ChipCheckboxProps = ChipBaseProps & Label;
export type ChipRadioProps = ChipBaseProps & Label;

const render = <
  I extends InputHTMLAttributes<HTMLInputElement> | undefined,
  T extends I extends undefined ? HTMLButtonElement : HTMLLabelElement,
  R extends I extends undefined ? ChipButtonProps : ChipRadioProps,
>(
  { asChild, className, children, size = 'md', ...rest }: R,
  ref: ForwardedRef<T>,
  input?: I,
) => {
  const tagName: string = input ? 'label' : 'button';
  const Component = asChild ? Slot : tagName;

  return (
    <Paragraph size={size} asChild>
      <Component
        className={cl('ds-chip', className)}
        data-size={size}
        type={asChild || input ? undefined : 'button'}
        ref={ref}
        {...rest}
      >
        {input && <input {...input} />}
        <Slottable>{children}</Slottable>
      </Component>
    </Paragraph>
  );
};

/**
 * Chip.Button used for interaction
 * @example
 * <Chip.Button>Click me</Chip.Button>
 */
export const ChipButton = forwardRef<HTMLButtonElement, ChipButtonProps>(
  function ChipButton(props, ref) {
    return render(props, ref);
  },
);

/**
 * Chip.Removable used for interaction
 * @example
 * <Chip.Removable>Click me</Chip.Removable>
 */
export const ChipRemovable = forwardRef<HTMLButtonElement, ChipButtonProps>(
  function ChipRemovable(props, ref) {
    return render({ 'data-removable': true, ...props }, ref);
  },
);

/**
 * Chip.Checkbox used for multiselection
 * @example
 * <Chip.Checkbox name="language">Nynorsk</Chip.Checkbox>
 * <Chip.Checkbox name="language">Bokmål</Chip.Checkbox>
 */
export const ChipCheckbox = forwardRef<HTMLLabelElement, ChipCheckboxProps>(
  function ChipCheckbox({ checked, name, value, disabled, ...props }, ref) {
    return render(props, ref, {
      checked,
      disabled,
      name,
      type: 'checkbox',
      value,
    });
  },
);

/**
 * Chip.Radio used for single selection
 * @example
 * <Chip.Radio name="language">Nynorsk</Chip.Radio>
 * <Chip.Radio name="language">Bokmål</Chip.Radio>
 */
export const ChipRadio = forwardRef<HTMLLabelElement, ChipRadioProps>(
  function ChipRadio({ name, value, checked, disabled, ...props }, ref) {
    return render(props, ref, {
      checked,
      disabled,
      name,
      type: 'radio',
      value,
    });
  },
);
