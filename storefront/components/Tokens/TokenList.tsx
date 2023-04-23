import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { FilesIcon } from '@navikt/aksel-icons';

import { capitalizeString } from '../../utils/StringHelpers';

import { TokenColor } from './TokenColor/TokenColor';
import { TokenFontSize } from './TokenFontSize/TokenFontSize';
import { TokenShadow } from './TokenShadow/TokenShadow';
import classes from './TokenList.module.css';

interface TokensProps {
  type: 'color' | 'fontSize' | 'shadow';
  showValue?: boolean;
  token: string;
}

type OutputType = {
  [key: string]: string;
};

const formatTitle = (title: string) => {
  return title.replace(/-/g, ' ');
};

const TokenList = ({ type, showValue = true, token }: TokensProps) => {
  const [items, setItems] = useState<OutputType>({});
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const swrRes = useSWR('/api/tokens', fetcher);
  const data = swrRes.data as OutputType;

  useEffect(() => {
    if (data) {
      const obj: OutputType = {};

      Object.keys(data).map((key) => {
        if (key.startsWith(token)) {
          obj[key] = data[key].replace(';', '').replace('}', '');
        }
      });
      setItems(obj);
    }
  }, [data, token]);

  return (
    <div className={classes.tokens}>
      <div className={classes.cards}>
        {Object.keys(items).map((key, index) => (
          <div
            key={index}
            className={classes.card}
          >
            <div className={classes.preview}>
              {type === 'color' && <TokenColor value={items[key]} />}
              {type === 'fontSize' && <TokenFontSize value={items[key]} />}
              {type === 'shadow' && <TokenShadow value={items[key]} />}
            </div>
            <div className={classes.text}>
              <h4 className={classes.title}>
                {capitalizeString(formatTitle(key.split(token)[1].slice(1)))}
              </h4>
              <div className={classes.copy}>
                <div>--{key}</div>
                <div className={classes.copyIcon}>
                  <FilesIcon
                    fontSize={24}
                    color='#585858'
                  />
                </div>
              </div>
              {showValue && <div className={classes.value}>{items[key]}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { TokenList };
