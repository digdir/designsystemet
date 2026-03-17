import {
  Paragraph,
  Table,
  type TableProps,
} from '@digdir/designsystemet-react';
import cl from 'clsx';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

type CssAttributesProps = {
  vars: {
    [key: string]: string;
  };
} & TableProps;

export const CssAttributes = forwardRef<HTMLTableElement, CssAttributesProps>(
  function CssAttributes({ vars, className, ...rest }, ref) {
    const { t } = useTranslation();

    if (Object.keys(vars).length === 0)
      return (
        <Paragraph>{t('components.no-relevant-data-attributes')}</Paragraph>
      );
    return (
      <Table
        className={cl('component-table', className)}
        data-color='neutral'
        border
        zebra
        style={{
          tableLayout: 'fixed',
        }}
        {...rest}
        ref={ref}
      >
        <caption style={{ marginBottom: 'var(--ds-size-4)' }}>
          {t('components.data-attributes')}
        </caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>
              {t('components.css-variables.name')}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t('components.css-variables.value')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {Object.entries(vars).map(([name, value]) => (
            <Table.Row key={name}>
              <Table.Cell>data-{name}</Table.Cell>
              <Table.Cell>{value}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
);

/* returns data-attributes and their possible values as key value pairs*/
export function getAttributes(css: string) {
  const res: { [key: string]: Set<unknown> | string } = {};
  //filter out global attributes referenced locally
  const globals = ['color', 'size', 'color-scheme'];

  const allAttrs = Array.from(
    css.matchAll(/\[data-([^=\]]+)(?:=([^\]]+))?\]/g),
  ).map((matches) => ({ [matches[1]]: matches[2] }));

  for (const attr of allAttrs) {
    for (const [key, value] of Object.entries(attr)) {
      if (globals.includes(key)) continue;
      if (!res[key]) {
        res[key] = new Set();
      }
      if (value) (res[key] as Set<unknown>).add(value);
    }
  }
  for (const key of Object.keys(res)) {
    res[key] = Array.from(res[key]).join(', ');
  }

  return res as { [key: string]: string };
}
