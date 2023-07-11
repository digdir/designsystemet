import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { capitalizeString } from '../../utils/StringHelpers';
import { ClipboardBtn } from '../ClipboardBtn/ClipboardBtn';

import { TokenColor } from './TokenColor/TokenColor';
import { TokenFontSize } from './TokenFontSize/TokenFontSize';
import { TokenShadow } from './TokenShadow/TokenShadow';
import { TokenSize } from './TokenSize/TokenSize';
import classes from './TokenList.module.css';

interface TokensProps {
  type: 'color' | 'fontSize' | 'shadow' | 'size';
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

  const queryResponse = useQuery({
    queryKey: ['tokens'],
    queryFn: () => fetch('/api/tokens').then((response) => response.json()),
  });
  const data = queryResponse.data as OutputType;

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

  if (queryResponse.isLoading) return 'Henter tokens...';

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
              {type === 'size' && <TokenSize value={items[key]} />}
            </div>
            <div className={classes.text}>
              <h4 className={classes.title}>
                {capitalizeString(formatTitle(key.split(token)[1].slice(1)))}
                <ClipboardBtn text={key} />
              </h4>
              {showValue && <div className={classes.value}>{items[key]}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { TokenList };
