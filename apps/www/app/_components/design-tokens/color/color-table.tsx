import { Field, Heading, Label, Select, Table } from '@digdir/designsystemet-react';
import { useState, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from '~/_utils/string-helpers';
import type { PreviewToken } from '../types';
import { ColorDark, ColorLight } from './color-previews';

type TokenTableProps = {
  colorTokens: Record<string, PreviewToken[]>;
} & HTMLAttributes<HTMLDivElement>;

export const ColorTokensTable = ({ colorTokens }: TokenTableProps) => {
  const { t } = useTranslation();
  const colors = Object.keys(colorTokens);
  const [selectedColor, setSelectedColor] = useState<typeof colors[number]>('neutral');
  const tokens = colorTokens[selectedColor] || [];

  return <div data-color={selectedColor}>
    <Field>
      <Label>{t('token-preview.color.select-label')}</Label>
      <Select
        value={selectedColor || ''}
        onChange={(e) => setSelectedColor(e.target.value as typeof colors[number])}
      >
      {colors.map((color) => (
        <Select.Option key={color} value={color}>
          {capitalizeString(color)}
        </Select.Option>
      ))}
    </Select>
    </Field>
      <Table data-color='neutral' data-colors={colors} key={selectedColor}>
      <caption>
        <Heading level={4} data-size='md'>
          {capitalizeString(selectedColor)}
        </Heading>
      </caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>{t('token-preview.table.name')}</Table.HeaderCell>
          <Table.HeaderCell>{t('token-preview.table.light')}</Table.HeaderCell>
          <Table.HeaderCell>{t('token-preview.table.dark')}</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {tokens.map((token) => {
          const name = token.variable;
          const value = token.value;
          return (
            <Table.Row key={name}>
              <Table.Cell>
                <code>{name}</code>
              </Table.Cell>
              <Table.Cell>
                <ColorLight colorVariable={value} />
              </Table.Cell>
              <Table.Cell>
                <ColorDark colorVariable={value} />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  </div>
};
