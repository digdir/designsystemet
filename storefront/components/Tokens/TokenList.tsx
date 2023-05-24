import React, { useEffect, useState } from 'react';
import * as tokensImport from '@digdir/design-system-tokens';

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

const convertJsToCssVariable = (input: string) => {
  return 'fds-' + input.replace(/_/g, '-');
};

const TokenList = ({ type, showValue = true, token }: TokensProps) => {
  const [items, setItems] = useState<OutputType>({});
  const tokens: OutputType = tokensImport;

  useEffect(() => {
    const formatedOutput: OutputType = {};

    Object.keys(tokens).map((key) => {
      const cssVariable: string = convertJsToCssVariable(key);
      if (cssVariable.startsWith(token)) {
        formatedOutput[cssVariable] = tokens[key];
      }
    });
    setItems(formatedOutput);
  }, [token, tokens]);

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
                {capitalizeString(formatTitle(key.split(token)[1]))}
                {showValue && <div className={classes.value}>{items[key]}</div>}
              </h4>
              <div className={classes.copy}>
                <div>--{key}</div>
                <ClipboardBtn text={key} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { TokenList };
