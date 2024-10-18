import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { omit } from '../../../utilities';
import { Label } from '../../Label';
import { ValidationMessage } from '../../ValidationMessage';
import { Field } from '../Field';
import { Input } from '../Input';
import type { FormFieldProps } from '../useFormField';

import { useCheckbox } from './useCheckbox';

export type CheckboxProps = {
  /** Checkbox label */
  label?: ReactNode;
  /** Description for field */
  description?: ReactNode;
  /** Value of the `input` element */
  value: string;
  /** Validation message for field */
  validation?: ReactNode;
  /**
   * Changes field size and paddings
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /**Toggle indeterminate state for Checkbox
   * @default false
   */
  indeterminate?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { children, label, description, validation, ...rest },
    ref,
  ) {
    // const { children, description, className, style, ...rest } = props;
    // const {
    //   inputProps,
    //   descriptionId,
    //   hasError,
    //   size = 'md',
    //   readOnly,
    // } = useCheckbox(props);

    // const inputRef = useMergeRefs<HTMLInputElement>([
    //   ref,
    //   (el) => {
    //     if (el) el.indeterminate = rest.indeterminate ?? false;
    //   },
    // ]);

    return (
      <Field>
        <Input type='checkbox' ref={ref} {...rest} />
        {label && <Label weight='regular'>{label}</Label>}
        {description && <div data-field='description'>{description}</div>}
        {validation && <ValidationMessage>{validation}</ValidationMessage>}
      </Field>
    );

    // return (
    //   <Paragraph asChild size={size}>
    //     <div
    //       className={cl(
    //         'ds-checkbox',
    //         `ds-checkbox--${size}`,
    //         hasError && `ds-checkbox--error`,
    //         readOnly && `ds-checkbox--readonly`,
    //         className,
    //       )}
    //       style={style}
    //     >
    //       <input
    //         className={`ds-checkbox__input`}
    //         ref={inputRef}
    //         {...omit(['size', 'error', 'indeterminate'], rest)}
    //         {...inputProps}
    //         type='checkbox'
    //         disabled={inputProps.disabled}
    //         aria-checked={rest.indeterminate ? 'mixed' : inputProps.checked}
    //       />
    //       {children && (
    //         <>
    //           <Label
    //             className={cl(`ds-checkbox__label`)}
    //             htmlFor={inputProps.id}
    //             size={size}
    //             weight='regular'
    //           >
    //             <span>{children}</span>
    //           </Label>
    //           {description && (
    //             <Paragraph asChild size={size}>
    //               <div
    //                 id={descriptionId}
    //                 className={`ds-checkbox__description`}
    //               >
    //                 {description}
    //               </div>
    //             </Paragraph>
    //           )}
    //         </>
    //       )}
    //     </div>
    //   </Paragraph>
    // );
  },
);
