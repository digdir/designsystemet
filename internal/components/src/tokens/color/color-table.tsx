import { Heading, Paragraph, Table } from '@digdir/designsystemet-react';
import { type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardButton } from '../../clipboard-button/clipboard-button';
import colorTokens from '../design-tokens/color.json';
import classes from './color.module.css';
import { ColorLight } from './color-previews';

const colorStructure = colorTokens.primary;

type TokenTableProps = {
  colorNames: string[];
} & HTMLAttributes<HTMLDivElement>;

export const ColorTokensTable = ({ colorNames }: TokenTableProps) => {
  const { t } = useTranslation();
  const [_selectedColor] = useState<(typeof colorNames)[number]>(
    colorNames[0] || 'neutral',
  );

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
              <span className={classes.colorVariable}>
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
