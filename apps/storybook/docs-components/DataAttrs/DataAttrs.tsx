import { Table } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { forwardRef, useEffect, useState } from 'react';

type DataAttributesProps = {
  css: string;
} & React.HTMLAttributes<HTMLTableElement>;

export const DataAttributes = forwardRef<HTMLTableElement, DataAttributesProps>(
  function DataAttributes({ css, className, ...rest }, ref) {
    const [attrs, setAttrs] = useState<{ [key: string]: string }>({});

    useEffect(() => {
      setAttrs(getAttrs(css || ''));
    }, [css, setAttrs]);

    return (
      <Table
        zebra
        className={cl('sb-unstyled', className)}
        style={{
          tableLayout: 'fixed',
        }}
        {...rest}
        ref={ref}
      >
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Value(s)</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {Object.entries(attrs).map(([name, value]) => (
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

/* returns data atrributes and their possible values as key value pairs*/
function getAttrs(css: string) {
  const res: { [key: string]: Set<unknown> | string } = {};

  const allAttrs = Array.from(
    css.matchAll(/\[data-([^=\]]+)(?:=([^\]]+))?\]/g),
  ).map((matches) => ({ [matches[1]]: matches[2] }));

  for (const attr of allAttrs) {
    for (const [key, value] of Object.entries(attr)) {
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
