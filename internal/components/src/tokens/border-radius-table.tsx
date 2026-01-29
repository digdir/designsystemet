import { useTranslation } from 'react-i18next';
import semanticTokens from './design-tokens/semantic.json';
import {
  type SemanticTableProps,
  SemanticVariablesTable,
} from './semantic-table';

const borderRadiusTokens = semanticTokens.filter(({ variable }) =>
  /^--ds-border-radius/.test(variable),
);

export const styleBorderRadiusVars = borderRadiusTokens.reduce(
  (acc, token) => {
    acc[token.variable] = token.value;
    return acc;
  },
  {} as Record<string, string>,
);

export const BorderRadiusVariablesTable = (props: SemanticTableProps) => {
  const { t } = useTranslation();

  return (
    <SemanticVariablesTable
      tokens={borderRadiusTokens}
      style={styleBorderRadiusVars}
      caption={t('token-preview.border-radius.caption')}
      {...props}
    />
  );
};
