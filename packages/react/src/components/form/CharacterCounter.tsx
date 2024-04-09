import utilityClasses from '../../utilities/utility.module.css';
import { ErrorMessage } from '../Typography';

export type CharacterLimitProps = Omit<
  CharacterCounterProps,
  'id' | 'value' | 'size'
>;

type CharacterCounterProps = {
  /** The message indicating the remaining character limit. */
  label?: (count: number) => string;
  /** The description of the maximum character limit for screen readers. */
  srLabel?: string;
  /** The maximum allowed character count. */
  maxCount: number;
  /** The current value. */
  value: string;
  /** The ID of the element that describes the maximum character limit for accessibility purposes. */
  id: string;
  /** Text size */
  size?: 'small' | 'medium' | 'large';
};

const defaultLabel: CharacterCounterProps['label'] = (count) =>
  count > -1 ? `${count} tegn igjen` : `${Math.abs(count)} tegn for mye`;

const defaultSrLabel = (maxCount: number) =>
  `Tekstfelt med plass til ${maxCount} tegn`;

export const CharacterCounter = ({
  label = defaultLabel,
  srLabel: propsSrLabel,
  maxCount,
  value,
  id,
  size,
}: CharacterCounterProps): JSX.Element => {
  const currentCount = maxCount - value.length;
  const hasExceededLimit = value.length > maxCount;
  const srLabel = propsSrLabel ? propsSrLabel : defaultSrLabel(maxCount);

  return (
    <>
      <span
        className={utilityClasses.visuallyHidden}
        id={id}
      >
        {srLabel}
      </span>
      <ErrorMessage
        asChild
        size={size}
        error={hasExceededLimit}
      >
        <span aria-live={hasExceededLimit ? 'polite' : 'off'}>
          {label(currentCount)}
        </span>
      </ErrorMessage>
    </>
  );
};

CharacterCounter.displayName = 'CharacterCounter';
