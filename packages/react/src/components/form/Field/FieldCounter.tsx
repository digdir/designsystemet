import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  ValidationMessage,
  type ValidationMessageProps,
} from '../../ValidationMessage';

export type FieldCounterProps = {
  /** Label template for when `maxCount` is exceeded
   * @default '%d tegn for mye'
   */
  over?: string;
  /** Label template for count
   * @default '%d tegn igjen'
   */
  under?: string;
  /** The maximum allowed characters. */
  limit: number;
} & ValidationMessageProps;

const label = (text: string, count: number) =>
  text.replace('%d', Math.abs(count).toString());

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
      const onInput = ({ target }: Event) => {
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        ) {
          setCount(target.value.length);
        }
      };

      const field = counterRef.current?.closest('.ds-field');

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
        <ValidationMessage error={hasExceededLimit} ref={ref} {...rest}>
          {label(hasExceededLimit ? over : under, remainder)}
        </ValidationMessage>
      </>
    );
  },
);
