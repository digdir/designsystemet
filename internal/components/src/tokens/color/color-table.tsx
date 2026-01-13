import { Heading, Paragraph, Table } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { ClipboardButton } from '../../clipboard-button/clipboard-button';
import colorTokens from '../design-tokens/color.json';
import classes from './color.module.css';

const colorStructure = colorTokens.primary;

export const ColorTokensTable = () => {
  const { t } = useTranslation();

  return (
    <Table data-size='sm'>
      <caption>
        <Heading level={4} data-size='md'>
          {t('token-preview.table.caption')}
        </Heading>
        <Paragraph data-size='sm'>
          {t('token-preview.table.description')}
        </Paragraph>
      </caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>{t('token-preview.table.name')}</Table.HeaderCell>
          <Table.HeaderCell>
            {t('token-preview.table.preview')}
          </Table.HeaderCell>
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
            <Table.Cell>
              <div
                className={classes.color}
                style={{ backgroundColor: `var(${variable})` }}
              ></div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
