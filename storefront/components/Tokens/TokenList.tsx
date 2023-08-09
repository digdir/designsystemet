import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { capitalizeString } from '../../utils/StringHelpers';
import { ClipboardBtn } from '../ClipboardBtn/ClipboardBtn';

import { TokenColor } from './TokenColor/TokenColor';
import { TokenFontSize } from './TokenFontSize/TokenFontSize';
import { TokenShadow } from './TokenShadow/TokenShadow';
import { TokenSize } from './TokenSize/TokenSize';
import classes from './TokenList.module.css';
import { color } from 'tokens/tokens';

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

  const card = (item: { value: string; name: string; path: [] }) => {
    console.log(item);

    return (
      <div className={classes.card}>
        <div className={classes.preview}>
          {type === 'color' && <TokenColor value={item.value} />}
          {type === 'fontSize' && <TokenFontSize value={item.value} />}
          {type === 'shadow' && <TokenShadow value={item.value} />}
          {type === 'size' && <TokenSize value={item.value} />}
        </div>
        <div className={classes.text}>
          <h4 className={classes.title}>
            {item.path[item.path.length - 1]}
            <ClipboardBtn
              text='Kopier CSS variabel'
              value='Kopier CSS variabel'
            />
          </h4>
          <div className={classes.value}>{item.value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.tokens}>
      {Object.keys(color).map((key, index) => (
        <div
          key={index}
          className={classes.sections}
        >
          <h3>{key}</h3>
          {Array.isArray(color[key]) && (
            <div className={classes.cards}>
              {color[key].map((item, index) => card(item))}
            </div>
          )}
          {!Array.isArray(color[key]) && (
            <div className={classes.cards}>
              {Object.keys(color).map((key2, index2) => (
                <div key={index2}>{key2}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { TokenList };
