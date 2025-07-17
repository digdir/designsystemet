import {
  Field,
  Heading,
  Label,
  Paragraph,
  Search,
  useDebounceCallback,
} from '@digdir/designsystemet-react';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from '~/_utils/string-helpers';
import { ColorTokensTable } from '../color/color-table';
import colorTokens from '../design-tokens/color.json';
import semanticTokens from '../design-tokens/semantic.json';
import typeScaleTokens from '../design-tokens/type-scale.json';
import typographyTokens from '../design-tokens/typography.json';
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
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('');

  const debouncedCallback = useDebounceCallback((value: string) => {
    setValue(value);
  }, 1000);

  const filteredColorTokens = filteredRecord(colorTokens, value);
  const colorTokensCount = Object.keys(filteredColorTokens);
  const filteredTypographyTokens = Object.entries(
    filteredRecord(typographyTokens, value),
  );
  const filteredSemanticTokens = semanticTokens.filter((token) =>
    tokenSearchFilter(token, value),
  );

  const noSearchResult =
    filteredSemanticTokens.length +
      filteredTypographyTokens.length +
      colorTokensCount.length ===
    0;

  return (
    <>
      <Field>
        <Label>{t('token-preview.search-in-design-tokens')}</Label>
        <Search>
          <Search.Input
            aria-label={t('token-preview.search-input-aria-label')}
            onChange={(e) => debouncedCallback(e.target.value)}
          />
          <Search.Clear />
        </Search>
      </Field>

      <div className={classes.tokens}>
        {colorTokensCount.length > 0 && (
          <>
            <Heading level={3} data-size='lg'>
              {t('token-preview.colors')}
            </Heading>
            <Paragraph>{t('token-preview.color.description')}</Paragraph>
            <div className={classes.section}>
              <ColorTokensTable colorTokens={filteredColorTokens} />
            </div>
          </>
        )}

        {filteredTypographyTokens.length > 0 &&
          filteredTypographyTokens.map(([name, tokens]) => {
            return (
              <Fragment key={name}>
                <Heading level={3} data-size='lg'>
                  {t('token-preview.typography')}
                </Heading>
                <div className={classes.section}>
                  <Heading level={4} data-size='md'>
                    {capitalizeString(name)}
                  </Heading>
                  <TypographyTable tokens={[...tokens, ...typeScaleTokens]} />
                </div>
              </Fragment>
            );
          })}
        {filteredSemanticTokens.length > 0 && (
          <>
            <Heading level={3} data-size='lg'>
              {t('token-preview.semantic')}
            </Heading>
            <Paragraph>{t('token-preview.size.description')}</Paragraph>
            <div className={classes.section}>
              <SemanticTokensTable tokens={filteredSemanticTokens} />
            </div>
          </>
        )}

        {noSearchResult && (
          <Paragraph>{t('token-preview.no-results')}</Paragraph>
        )}
      </div>
    </>
  );
};
