import { forwardRef, useEffect, useRef, useState } from 'react';
import { Paragraph } from '../paragraph/paragraph';
import {
  ValidationMessage,
  type ValidationMessageProps,
} from '../validation-message/validation-message';
import { isInputLike } from './field-observer';

export type FieldCounterProps = {
  /**
   * Label template for when `maxCount` is exceeded.
   * Use `%d` to insert the number of characters.
   *
   * @default '%d tegn for mye'
   */
  over?: string;
  /**
   * Label template for count.
   * Use `%d` to insert the number of characters.
   *
   * @default '%d tegn igjen'
   */
  under?: string;
  /**
   * The maximum allowed characters.
   *
   * @default undefined
   **/
  limit: number;
} & ValidationMessageProps;

const label = (text: string, count: number) =>
  text.replace('%d', Math.abs(count).toString());

/**
 * FieldCounter component, used to display a counter for a form field.
 *
 * @example
 * <Field>
 *   <Input />
 *   <Field.Counter limit={100} under='%d tegn igjen' over='%d tegn for mye' />
 * </Field>
 */
export const FieldCounter = forwardRef<HTMLParagraphElement, FieldCounterProps>(
  function FieldCounter(
    { limit, under = '%d tegn igjen', over = '%d tegn for mye', ...rest },
    ref,
  ) {
    const [count, setCount] = useState(0);
    const fieldInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const hasExceededLimit = count > limit;
    const remainder = limit - count;
    const Element = hasExceededLimit ? ValidationMessage : Paragraph;

    // Listen to native input events (user typing) to update the counter in real time
    useEffect(() => {
      const field = counterRef.current?.closest('.ds-field');
      const input = Array.from(field?.getElementsByTagName('*') || []).find(
        isInputLike,
      );
      const onInput = ({ target }: { target: Event['target'] }) => {
        if (isInputLike(target)) setCount(target.value.length);
      };

      if (input) onInput({ target: input }); // Initial setup
      fieldInputRef.current = input as HTMLInputElement | HTMLTextAreaElement;

      field?.addEventListener('input', onInput);
      return () => field?.removeEventListener('input', onInput);
    }, []);

    /* React does not dispatch a native input event when the value prop changes externally.
    Since the parent re-renders this component when value changes, we can sync on render. */
    useEffect(() => {
      if (fieldInputRef.current) {
        const valueLength = fieldInputRef.current.value.length;
        setCount((prev) => (prev === valueLength ? prev : valueLength));
      }
    });

    return (
      <>
        <div
          data-field='description'
          className='ds-sr-only'
          aria-live='polite'
          ref={counterRef}
        >
          {hasExceededLimit && label(over, remainder)}
        </div>

        <Element ref={ref} {...rest} data-field='validation' aria-hidden='true'>
          {label(hasExceededLimit ? over : under, remainder)}
        </Element>
      </>
    );
  },
);
