import {
  Field,
  Heading,
  Label,
  Select,
  Table,
} from '@digdir/designsystemet-react';
import { type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from '../../_utils';
import colorTokens from '../design-tokens/color.json';
import { ColorDark, ColorLight } from './color-previews';

const _colorStructure = colorTokens.primary;

type TokenTableProps = {
  colorNames: string[];
} & HTMLAttributes<HTMLDivElement>;

export const ColorTokensTable = ({ colorNames }: TokenTableProps) => {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] =
    useState<(typeof colorNames)[number]>('neutral');

  return (
    <div data-color={selectedColor}>
      <Field>
        <Label>{t('token-preview.color.select-label')}</Label>
        <Select
          value={selectedColor || ''}
          onChange={(e) =>
            setSelectedColor(e.target.value as (typeof colorNames)[number])
          }
        >
          {colorNames.map((color) => (
            <Select.Option key={color} value={color}>
              {color}
            </Select.Option>
          ))}
        </Select>
      </Field>
      <Table data-color='neutral' data-colors={colorNames} key={selectedColor}>
        <caption>
          <Heading level={4} data-size='md'>
            {capitalizeString(selectedColor)}
          </Heading>
        </caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{t('token-preview.table.name')}</Table.HeaderCell>
            <Table.HeaderCell>
              {t('token-preview.table.light')}
            </Table.HeaderCell>
            <Table.HeaderCell>{t('token-preview.table.dark')}</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {_colorStructure.map((token) => {
            const name = token.variable;
            return (
              <Table.Row key={name}>
                <Table.Cell>
                  <code>{name}</code>
                </Table.Cell>
                <Table.Cell>
                  <ColorLight colorVariable={`var(${name})`} />
                </Table.Cell>
                <Table.Cell>
                  <ColorDark colorVariable={`var(${name})`} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
