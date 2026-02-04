import { useTranslation } from 'react-i18next';
import semanticTokens from './design-tokens/semantic.json';
import {
  type SemanticTableProps,
  SemanticVariablesTable,
} from './semantic-table';

const borderWidthTokens = semanticTokens.filter(({ variable }) =>
  /^--ds-border-width/.test(variable),
);

export const styleBorderWidthVars = borderWidthTokens.reduce(
  (acc, token) => {
    acc[token.variable] = token.value;
    return acc;
  },
  {} as Record<string, string>,
);

export const BorderWidthVariablesTable = (props: SemanticTableProps) => {
  const { t } = useTranslation();

  return (
    <SemanticVariablesTable
      tokens={borderWidthTokens}
      style={styleBorderWidthVars}
      caption={t('token-preview.border-width.caption')}
      {...props}
    />
  );
};
