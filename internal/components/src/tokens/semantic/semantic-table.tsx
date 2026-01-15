import {
  Field,
  Heading,
  Label,
  Paragraph,
  Select,
  Table,
} from '@digdir/designsystemet-react';
import type { Size } from '@digdir/designsystemet-types';
import { groupBy } from 'ramda';
import { type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import semanticTokens from '../design-tokens/semantic.json';
import sizeTokens from '../design-tokens/size.json';

import type { PreviewToken } from '../types';
import {
  BorderRadius,
  BorderWidth,
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
  if (/^--ds-size.*(\d+|unit)$/.test(variable)) {
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

  if (/^--ds-border-width/.test(variable)) {
    return <BorderWidth value={value} />;
  }

  return <code>{value}</code>;
};

const getValueRender = (variable: string, value: string, size?: string) => {
  if (!/opacity|shadow|size-base|size-step/.test(variable)) {
    return <ComputedValue value={value} size={size} />;
  }

  return <code>{value}</code>;
};

export const SemanticVariablesTable = ({
  heading,
  withPreview = false,
  description,
}: {
  heading?: string;
  withPreview?: boolean;
  description?: string;
}) => {
  const { t } = useTranslation();

  return (
    <div key={heading} className={classes['overflow-table']}>
      <Table data-color='accent'>
        <caption>
          <Heading level={4} data-size='md'>
            {heading ?? t('token-preview.semantic.heading')}
          </Heading>
          <Paragraph data-size='sm'>
            {description ?? t('token-preview.semantic.description')}
          </Paragraph>
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
          {semanticTokens?.map(({ variable, value }) => (
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

export const SizeVariablesTable = ({
  heading,
  withPreview = false,
  description,
}: {
  heading?: string;
  description?: string;
  withPreview?: boolean;
}) => {
  const { t } = useTranslation();
  const sizes: Size[] = ['sm', 'md', 'lg'];
  const [selectedSize, setSelectedSize] = useState<Size>('md');

  return (
    <div key={heading}>
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
      <div key={heading} className={classes['overflow-table']}>
        <Table data-size='sm'>
          <caption>
            <Heading level={4} data-size='md'>
              {heading ?? t('token-preview.size.heading')}
            </Heading>
            <Paragraph data-size='sm'>
              {description ?? t('token-preview.size.description')}
            </Paragraph>
          </caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {t('token-preview.table.name')}
              </Table.HeaderCell>
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
            {sizeTokens?.map(({ variable, value }) => (
              <Table.Row key={variable}>
                <Table.Cell>
                  <code>{variable}</code>
                </Table.Cell>

                {withPreview && (
                  <>
                    <Table.Cell>
                      {getValueRender(variable, value, selectedSize)}
                    </Table.Cell>
                    <Table.Cell>
                      {getValuePreview(variable, value, selectedSize)}
                    </Table.Cell>
                  </>
                )}
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
      return <SizeVariablesTable key={prettyPath} heading={prettyPath} />;
    }

    return <SemanticVariablesTable key={prettyPath} heading={prettyPath} />;
  });
};
