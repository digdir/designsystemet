import { forwardRef, useEffect, useRef, useState } from 'react';
import { Paragraph } from '../Paragraph';
import {
  ValidationMessage,
  type ValidationMessageProps,
} from '../ValidationMessage';
import { isInputLike } from './fieldObserver';

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
    const counterRef = useRef<HTMLDivElement>(null);
    const hasExceededLimit = count > limit;
    const remainder = limit - count;

    useEffect(() => {
      const field = counterRef.current?.closest('.ds-field');
      const input = Array.from(field?.getElementsByTagName('*') || []).find(
        isInputLike,
      );
      const onInput = ({ target }: { target: Event['target'] }) => {
        if (isInputLike(target)) setCount(target.value.length);
      };

      if (input) onInput({ target: input }); // Initial setup

      field?.addEventListener('input', onInput);
      return () => field?.removeEventListener('input', onInput);
    }, [setCount]);

    return (
      <>
        <div
          data-field='description'
          className='ds-sr-only'
          aria-live={'polite'}
          ref={counterRef}
        >
          {hasExceededLimit && label(over, remainder)}
        </div>
        {hasExceededLimit ? (
          <ValidationMessage ref={ref} {...rest}>
            {label(over, remainder)}
          </ValidationMessage>
        ) : (
          <Paragraph ref={ref} {...rest} data-field='validation'>
            {label(under, remainder)}
          </Paragraph>
        )}
      </>
    );
  },
);
