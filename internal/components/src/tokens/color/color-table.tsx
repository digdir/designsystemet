import { Heading, Paragraph, Table } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { ClipboardButton } from '../../clipboard-button/clipboard-button';
import colorTokens from '../design-tokens/color.json';
import classes from './color.module.css';

const colorStructure = colorTokens.primary;
type ColorTokensTableProps = {
  withPreview?: boolean;
  heading?: string;
  description?: string;
};

export const ColorTokensTable = ({
  withPreview = false,
  heading,
  description,
}: ColorTokensTableProps) => {
  const { t } = useTranslation();

  return (
    <Table data-size='sm'>
      <caption>
        <Heading level={4} data-size='md'>
          {heading ?? t('token-preview.color.heading')}
        </Heading>
        <Paragraph data-size='sm'>
          {description ?? t('token-preview.color.description')}
        </Paragraph>
      </caption>
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
              <span className={classes.codeCopy}>
                <ClipboardButton value={variable} />
                <code>{variable}</code>
              </span>
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
