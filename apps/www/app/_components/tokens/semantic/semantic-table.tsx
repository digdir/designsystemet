import {
  Field,
  Heading,
  Label,
  Select,
  type Size,
  Table,
} from '@digdir/designsystemet-react';
import { groupBy } from 'ramda';
import { type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from '~/_utils/string-helpers';
import type { PreviewToken } from '../types';
import {
  BorderRadius,
  ComputedValue,
  Opacity,
  Shadow,
  Size as SizePreview,
} from './seamantic-previews';
import classes from './semantic.module.css';

type TokenTableProps = {
  tokens: PreviewToken[];
} & HTMLAttributes<HTMLDivElement>;

const groupedByPathIndex = (index = 0) =>
  groupBy((token: PreviewToken) => token.path[index] || 'rest');

const getValuePreview = (variable: string, value: string, size?: string) => {
  if (/^--ds-size.*\d$/.test(variable)) {
    return <SizePreview value={value} size={size} />;
  }
  if (/^--ds-border-radius(?!.*(scale|base)$)/.test(variable)) {
    return <BorderRadius value={value} />;
  }

  if (/^--ds-shadow/.test(variable)) {
    return <Shadow value={value} />;
  }

  if (/^--ds-opacity/.test(variable)) {
    return <Opacity value={value} />;
  }

  return <code>{value}</code>;
};

const getValueRender = (variable: string, value: string, size?: string) => {
  if (!/opacity|shadow|size-base|size-step/.test(variable)) {
    return <ComputedValue value={value} size={size} />;
  }

  return <code>{value}</code>;
};

const DefaultSemanticTable = ({
  tokens,
  title,
}: {
  tokens: PreviewToken[];
  title: string;
}) => {
  const { t } = useTranslation();

  return (
    <div key={title} className={classes['overflow-table']}>
      <Table data-color='neutral'>
        <caption>
          <Heading level={5} data-size='sm'>
            {capitalizeString(title)}
          </Heading>
        </caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{t('token-preview.table.name')}</Table.HeaderCell>
            <Table.HeaderCell>
              {t('token-preview.table.value')}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t('token-preview.table.variable')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {tokens?.map(({ variable, value }) => (
            <Table.Row key={variable}>
              <Table.Cell>
                <code>{variable}</code>
              </Table.Cell>
              <Table.Cell>{getValueRender(variable, value)}</Table.Cell>
              <Table.Cell>{getValuePreview(variable, value)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

const SemanticSizeTable = ({
  tokens,
  title,
}: {
  tokens: PreviewToken[];
  title: string;
}) => {
  const { t } = useTranslation();
  const sizes: Size[] = ['sm', 'md', 'lg'];
  const [selectedSize, setSelectedSize] = useState<Size>('md');

  return (
    <div key={title}>
      <Field>
        <Label>{t('token-preview.size.select-label')}</Label>
        <Select
          value={selectedSize || ''}
          onChange={(e) =>
            setSelectedSize(e.target.value as (typeof sizes)[number])
          }
        >
          {sizes.map((size) => (
            <Select.Option key={size} value={size}>
              {size}
            </Select.Option>
          ))}
        </Select>
      </Field>
      <div key={title} className={classes['overflow-table']}>
        <Table data-color='neutral'>
          <caption>
            <Heading level={5} data-size='sm'>
              {capitalizeString(title)}
            </Heading>
          </caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {t('token-preview.table.name')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('token-preview.table.value')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('token-preview.table.variable')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {tokens?.map(({ variable, value }) => (
              <Table.Row key={variable}>
                <Table.Cell>
                  <code>{variable}</code>
                </Table.Cell>
                <Table.Cell>
                  {getValueRender(variable, value, selectedSize)}
                </Table.Cell>
                <Table.Cell>
                  {getValuePreview(variable, value, selectedSize)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export const SemanticTokensTable = ({ tokens }: TokenTableProps) => {
  const groupedTokens = groupedByPathIndex(0)(tokens);

  return Object.entries(groupedTokens).map(([path, tokens]) => {
    if (!tokens) {
      return null;
    }

    const prettyPath = path.replace(/_/g, ''); // Remove underscores from size tokens

    if (prettyPath === 'size') {
      return (
        <SemanticSizeTable
          key={prettyPath}
          tokens={tokens}
          title={prettyPath}
        />
      );
    }

    return (
      <DefaultSemanticTable
        key={prettyPath}
        tokens={tokens}
        title={prettyPath}
      />
    );
  });
};
