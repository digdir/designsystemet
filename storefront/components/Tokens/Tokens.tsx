import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { FilesIcon } from '@navikt/aksel-icons';

import { TokenColor } from './TokenColor/TokenColor';
import { TokenFontSize } from './TokenFontSize/TokenFontSize';
import classes from './Tokens.module.css';

interface TokensProps {
  tokenKey: string;
  type: 'color' | 'fontSize';
  showValue?: boolean;
  range?: string[];
}

type OutputType = {
  [key: string]: string;
};

const Tokens = ({
  tokenKey,
  type,
  range = [],
  showValue = true,
}: TokensProps) => {
  const [items, setItems] = useState<OutputType>({});
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const swrRes = useSWR('/api/tokens', fetcher);
  const data = swrRes.data as OutputType;

  useEffect(() => {
    if (data) {
      const obj: OutputType = {};

      if (range.length > 0) {
        const first = range[0];
        const second = range[1];
        let foundFirst = false;
        let foundSecond = false;
        Object.keys(data).map((key) => {
          if ('--' + key === first) {
            foundFirst = true;
          }

          if (foundFirst && !foundSecond) {
            console.log(key);
            obj[key] = data[key].replace(';', '');
            if ('--' + key === second) {
              foundSecond = true;
              console.log('d');
            }
          }
        });
        console.log(foundFirst, foundSecond);
      } else {
        Object.keys(data).map((key) => {
          if (key.startsWith(tokenKey)) {
            obj[key] = data[key].replace(';', '');
          }
        });
      }

      setItems(obj);
    }
  }, [data, tokenKey]);

  return (
    <div className={classes.tokens}>
      <div className={classes.cards}>
        {Object.keys(items).map((key, index) => (
          <div
            key={index}
            className={classes.card}
          >
            {type === 'color' && <TokenColor value={items[key]} />}
            {type === 'fontSize' && <TokenFontSize value={items[key]} />}

            <div className={classes.copy}>
              <div>--{key}</div>
              <div className={classes.copyIcon}>
                <FilesIcon
                  fontSize={23}
                  color='#585858'
                />
              </div>
            </div>
            {showValue && <div className={classes.value}>{items[key]}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Tokens };
