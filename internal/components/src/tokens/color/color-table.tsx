import { Heading, Paragraph, Table } from '@digdir/designsystemet-react';
import type { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardButton } from '../../clipboard-button/clipboard-button';
import colorTokens from '../design-tokens/color.json';
import classes from './color.module.css';
import { ColorLight } from './color-previews';

const colorStructure = colorTokens.primary;

type TokenTableProps = {
  color: string;
} & HTMLAttributes<HTMLDivElement>;

export const ColorTokensTable = ({ color }: TokenTableProps) => {
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
        <span data-size='sm' className={classes.codeCopy}>
          <code>data-color="{color}"</code>
          <ClipboardButton value={`data-color="${color}"`} />
        </span>
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
                <code>{variable}</code>
                <ClipboardButton value={variable} />
              </span>
            </Table.Cell>
            <Table.Cell>
              <ColorLight colorVariable={`var(${variable})`} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
