import { Table } from '@digdir/designsystemet-react';
import { forwardRef } from 'react';

type CssAttributesProps = {
  vars: {
    [key: string]: string;
  };
} & React.HTMLAttributes<HTMLTableElement>;

export const CssAttributes = forwardRef<HTMLTableElement, CssAttributesProps>(
  function CssAttributes({ vars, ...rest }, ref) {
    if (Object.keys(vars).length === 0) return null;
    return (
      <Table
        zebra
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
