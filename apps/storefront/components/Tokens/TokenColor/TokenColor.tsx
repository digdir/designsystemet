import { getColorByNumber } from '@digdir/designsystemet/color';
import { ColorModal } from '@repo/components';
import cl from 'clsx/lite';
import { useRef } from 'react';
import type { TransformedToken } from 'style-dictionary';

import type { ColorNumber, HexColor } from '@digdir/designsystemet/color';

import classes from './TokenColor.module.css';
interface TokenColorProps {
  value: HexColor;
  token: TransformedToken;
}

/* The original.value is something like "{global.yellow.1}", and we need to get the weight between the last . and } */
export function getColorNumber(value: string): ColorNumber | undefined {
  const firstSplit = value.split('.').pop()?.replace('}', '');

  const parsed = parseInt(firstSplit as string);

  return Number.isNaN(parsed) ? undefined : (parsed as ColorNumber);
}

const TokenColor = ({ value, token }: TokenColorProps) => {
  const colorModalRef = useRef<HTMLDialogElement>(null);

  const number = getColorNumber(token.original.$value as string);
  const Element = number ? 'button' : 'div';

  return (
    <>
      {number ? (
        <ColorModal
          number={number}
          hex={value}
          namespace={token.path[1]}
          colorModalRef={colorModalRef}
        />
      ) : null}
      <div className={classes.test}>
        <Element
          style={{ backgroundColor: value }}
          className={cl(classes.color, 'ds-focus')}
          onClick={() => number && colorModalRef.current?.showModal()}
          aria-label={
            number &&
            `Se mer om ${token.path[1]} ${getColorByNumber(number).displayName}`
          }
        ></Element>
      </div>
    </>
  );
};

export { TokenColor };
