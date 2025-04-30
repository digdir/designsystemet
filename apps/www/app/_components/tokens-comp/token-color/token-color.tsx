import { getColorMetadataByNumber } from '@digdir/designsystemet/color';
import cl from 'clsx/lite';
import { useRef } from 'react';
import type { TransformedToken } from 'style-dictionary';

import type {
  Color,
  ColorNumber,
  HexColor,
} from '@digdir/designsystemet/color';

import classes from './token-color.module.css';
interface TokenColorProps {
  value: HexColor;
  token: TransformedToken;
}

/* The original.value is something like "{global.yellow.1}", and we need to get the weight between the last . and } */
export function getColorNumber(value: string): ColorNumber | undefined {
  const digit = value.match(/^\d+$/)?.[0];
  const parsed = parseInt(digit || '');

  return Number.isNaN(parsed) ? undefined : (parsed as ColorNumber);
}

const TokenColor = ({ value, token }: TokenColorProps) => {
  const colorModalRef = useRef<HTMLDialogElement>(null);

  const number = getColorNumber(token.original.$value as string);
  const color: Color | undefined = number
    ? {
        ...getColorMetadataByNumber(number),
        number,
        hex: value,
      }
    : undefined;

  const namespace = token.path[1];

  return color ? (
    <>
      {/* <ColorModal
        namespace={namespace}
        colorModalRef={colorModalRef}
        color={color}
      /> */}
      <div className={classes.colorBox}>
        <button
          style={{ backgroundColor: value }}
          className={cl(classes.color, 'ds-focus')}
          onClick={() => colorModalRef.current?.showModal()}
          aria-label={`Se mer om ${namespace} ${color?.displayName}`}
        ></button>
      </div>
    </>
  ) : (
    <div className={classes.colorBox}>
      <div
        style={{ backgroundColor: value }}
        className={cl(classes.color, 'ds-focus')}
      ></div>
    </div>
  );
};

export { TokenColor };
