import { useTranslation } from 'react-i18next';
import semanticTokens from './design-tokens/semantic.json';
import {
  type SemanticTableProps,
  SemanticVariablesTable,
} from './semantic-table';

const shadowTokens = semanticTokens.filter(({ variable }) =>
  /^--ds-shadow/.test(variable),
);

export const styleShadowVars = shadowTokens.reduce(
  (acc, token) => {
    acc[token.variable] = token.value;
    return acc;
  },
  {} as Record<string, string>,
);

export const ShadowVariablesTable = (props: SemanticTableProps) => {
  const { t } = useTranslation();
  return (
    <SemanticVariablesTable
      tokens={shadowTokens}
      heading={t('token-preview.shadow.heading')}
      {...props}
    />
  );
};
