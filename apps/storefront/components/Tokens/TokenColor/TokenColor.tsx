import { getColorNameFromNumber } from '@digdir/designsystemet/color';
import { ColorModal } from '@repo/components';
import cl from 'clsx/lite';
import { useRef } from 'react';
import type { TransformedToken } from 'style-dictionary';

import type { ColorNumber } from '../../../../../packages/cli/src/colors/types';

import classes from './TokenColor.module.css';
interface TokenColorProps {
  value: string;
  token: TransformedToken;
}

/* The original.value is something like "{global.yellow.1}", and we need to get the weight between the last . and } */
export function getColorWeight(value: string): ColorNumber | undefined {
  const firstSplit = value.split('.').pop()?.replace('}', '');

  if (firstSplit?.includes('contrast-')) {
    if (firstSplit.includes('contrast-1')) {
      return 14;
    }
    return 15;
  }

  const parsed = parseInt(firstSplit as string);

  return Number.isNaN(parsed) ? undefined : (parsed as ColorNumber);
}

const TokenColor = ({ value, token }: TokenColorProps) => {
  const colorModalRef = useRef<HTMLDialogElement>(null);

  const weight = getColorWeight(token.original.$value as string);
  const Element = weight ? 'button' : 'div';

  return (
    <>
      {weight ? (
        <ColorModal
          weight={weight}
          hex={value}
          namespace={token.path[1]}
          colorModalRef={colorModalRef}
        />
      ) : null}
      <div className={classes.test}>
        <Element
          style={{ backgroundColor: value }}
          className={cl(classes.color, 'ds-focus')}
          onClick={() => weight && colorModalRef.current?.showModal()}
          aria-label={
            weight &&
            `Se mer om ${token.path[1]} ${getColorNameFromNumber(weight)}`
          }
        ></Element>
      </div>
    </>
  );
};

export { TokenColor };
