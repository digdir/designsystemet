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
}

type OutputType = {
  [key: string]: string;
};

const Tokens = ({ tokenKey, type, showValue = true }: TokensProps) => {
  const [items, setItems] = useState<OutputType>({});
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data } = useSWR('/api/tokens', fetcher);

  useEffect(() => {
    if (data) {
      const obj: OutputType = {};
      Object.keys(data).map((key) => {
        if (key.startsWith(tokenKey)) {
          obj[key] = data[key].replace(';', '').replace('\n', '');
        }
      });
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
