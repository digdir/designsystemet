import { Table } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import colorTokens from './design-tokens/color.json';
import classes from './table.module.css';

const colorStructure = colorTokens.primary;

type ColorTokensTableProps = {
  withPreview?: boolean;
  caption?: string;
  description?: string;
};

export const ColorTokensTable = ({
  withPreview = false,
  caption,
}: ColorTokensTableProps) => {
  const { t } = useTranslation();

  return (
    <Table data-size='sm'>
      <caption>{caption ?? t('token-preview.color.caption')}</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>{t('token-preview.table.name')}</Table.HeaderCell>
          {withPreview && (
            <Table.HeaderCell>
              {t('token-preview.table.preview')}
            </Table.HeaderCell>
          )}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {colorStructure.map(({ variable }) => (
          <Table.Row key={variable}>
            <Table.Cell>
              <code>{variable}</code>
            </Table.Cell>
            {withPreview && (
              <Table.Cell>
                <div
                  className={classes.color}
                  style={{ backgroundColor: `var(${variable})` }}
                ></div>
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
