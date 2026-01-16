import { Heading, Table } from '@digdir/designsystemet-react';
import type { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { getValuePreview, getValueRender } from './common';
import semanticTokens from './design-tokens/semantic.json';
import classes from './semantic.module.css';
import type { PreviewToken } from './types';

export type SemanticTableProps = {
  tokens?: PreviewToken[];
  heading?: string;
  withPreview?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const SemanticVariablesTable = ({
  tokens,
  heading,
  withPreview = false,
}: SemanticTableProps) => {
  const { t } = useTranslation();
  const previewTokens = tokens ?? semanticTokens;

  return (
    <div key={heading} className={classes['overflow-table']}>
      <Table data-color='accent'>
        <caption>
          <Heading level={4} data-size='md'>
            {heading ?? t('token-preview.semantic.heading')}
          </Heading>
        </caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{t('token-preview.table.name')}</Table.HeaderCell>
            {withPreview && (
              <>
                <Table.HeaderCell>
                  {t('token-preview.table.value')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('token-preview.table.preview')}
                </Table.HeaderCell>
              </>
            )}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {previewTokens?.map(({ variable, value }) => (
            <Table.Row key={variable}>
              <Table.Cell>
                <code>{variable}</code>
              </Table.Cell>
              {withPreview && (
                <>
                  <Table.Cell>{getValueRender(variable, value)}</Table.Cell>
                  <Table.Cell>{getValuePreview(variable, value)}</Table.Cell>
                </>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
