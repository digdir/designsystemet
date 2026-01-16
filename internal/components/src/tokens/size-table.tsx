import {
  Field,
  Heading,
  Label,
  Select,
  Table,
} from '@digdir/designsystemet-react';
import type { Size } from '@digdir/designsystemet-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getValuePreview, getValueRender } from './common';
import sizeTokens from './design-tokens/size.json';
import classes from './semantic.module.css';

export const SizeVariablesTable = ({
  heading,
  withPreview = false,
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
