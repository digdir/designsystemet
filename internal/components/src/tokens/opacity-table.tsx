import { useTranslation } from 'react-i18next';
import semanticTokens from './design-tokens/semantic.json';
import {
  type SemanticTableProps,
  SemanticVariablesTable,
} from './semantic-table';

const opacityTokens = semanticTokens.filter(({ variable }) =>
  /^--ds-opacity/.test(variable),
);

export const styleOpacityVars = opacityTokens.reduce(
  (acc, token) => {
    acc[token.variable] = token.value;
    return acc;
  },
  {} as Record<string, string>,
);

export const OpacityVariablesTable = (props: SemanticTableProps) => {
  const { t } = useTranslation();

  return (
    <SemanticVariablesTable
      tokens={opacityTokens}
      heading={t('token-preview.opacity.heading')}
      {...props}
    />
  );
};
