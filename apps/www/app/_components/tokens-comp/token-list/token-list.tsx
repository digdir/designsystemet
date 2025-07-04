import {
  Field,
  Heading,
  Label,
  Search,
  useDebounceCallback,
} from '@digdir/designsystemet-react';
import { useState } from 'react';
import { capitalizeString } from '~/_utils/string-helpers';
import colorTokens from '~/tokens/color.json';
import semanticTokens from '~/tokens/semantic.json';
import typographyTokens from '~/tokens/typography.json';
import { ColorTokensTable } from '../color/color-table';
import { SemanticTokensTable } from '../semantic/semantic-table';
import type { PreviewToken } from '../types';
import { TypographyTable } from '../typography/typography-table';
import classes from './token-list.module.css';

const tokenSearchFilter = (token: PreviewToken, searchValue: string) =>
  `${token.variable}${token.value}`
    .toLowerCase()
    .includes(searchValue?.toLowerCase() || '');

const filteredRecord = (
  record: Record<string, PreviewToken[]>,
  searchValue: string,
): Record<string, PreviewToken[]> => {
  return Object.entries(record).reduce(
    (acc, [name, tokens]) => {
      const filteredTokens = tokens.filter((token) =>
        tokenSearchFilter(token, searchValue),
      );
      if (filteredTokens.length > 0) {
        acc[name] = filteredTokens;
      }
      return acc;
    },
    {} as Record<string, PreviewToken[]>,
  );
};

export const TokenList = () => {
  const [value, setValue] = useState<string>('');

  const debouncedCallback = useDebounceCallback((value: string) => {
    setValue(value);
  }, 1000);

  const filteredColorTokens = Object.entries(
    filteredRecord(colorTokens, value),
  );
  const filteredTypographyTokens = Object.entries(
    filteredRecord(typographyTokens, value),
  );
  const filteredSemanticTokens = semanticTokens.filter((token) =>
    tokenSearchFilter(token, value),
  );

  return (
    <>
      <Field>
        <Label>Søk i design tokens</Label>
        <Search>
          <Search.Input
            aria-label='Søk på variabel navn i CSS for design tokens'
            onChange={(e) => debouncedCallback(e.target.value)}
          />
          <Search.Clear />
        </Search>
      </Field>

      <div className={classes.tokens}>
        {filteredColorTokens.length > 0 &&
          filteredColorTokens.map(([name, tokens]) => {
            return (
              <>
                <Heading level={3} data-size='lg'>
                  Farger
                </Heading>
                <div key={name as string} className={classes.section}>
                  <ColorTokensTable
                    tokens={tokens}
                    title={capitalizeString(name as string)}
                  />
                </div>
              </>
            );
          })}

        {filteredTypographyTokens.length > 0 &&
          filteredTypographyTokens.map(([name, tokens]) => {
            return (
              <>
                <Heading level={3} data-size='lg'>
                  Typografi
                </Heading>
                <div key={name as string} className={classes.section}>
                  <Heading level={4} data-size='md'>
                    {capitalizeString(name as string)}
                  </Heading>
                  <TypographyTable tokens={tokens} />
                </div>
              </>
            );
          })}
        {filteredSemanticTokens.length > 0 && (
          <>
            <Heading level={3} data-size='lg'>
              Semantiske
            </Heading>
            <div key={'semantic'} className={classes.section}>
              <SemanticTokensTable tokens={filteredSemanticTokens} />
            </div>
          </>
        )}
      </div>
    </>
  );
};
