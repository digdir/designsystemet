import type { TransformedToken } from 'style-dictionary';
import { ColorModal } from '@digdir/components';
import { useRef } from 'react';
import cl from 'clsx/lite';

import type { ColorNumber } from '../../../../../packages/cli/src/colors/types';

import classes from './TokenColor.module.css';
interface TokenColorProps {
  value: string;
  token: TransformedToken;
}

const TokenColor = ({ value, token }: TokenColorProps) => {
  const colorModalRef = useRef<HTMLDialogElement>(null);

  /* The original.value is something like "{global.yellow.1}", and we need to get the weight between the last . and } */
  const selectedColor =
    /* @ts-expect-error #2532 */
    (token.original.value as string)
      .split('.')
      .pop()
      .replace('}', '')
      .replace('contrast-', '') || '';

  const Element = parseInt(selectedColor) ? 'button' : 'div';

  return (
    <>
      {parseInt(selectedColor) ? (
        <ColorModal
          weight={parseInt(selectedColor) as ColorNumber}
          hex={value}
          namespace={token.path[1]}
          colorModalRef={colorModalRef}
        />
      ) : null}
      <div className={classes.test}>
        <Element
          style={{ backgroundColor: value }}
          className={cl(classes.color, 'ds-focus')}
          onClick={() =>
            parseInt(selectedColor) && colorModalRef.current?.showModal()
          }
        ></Element>
      </div>
    </>
  );
};

export { TokenColor };
