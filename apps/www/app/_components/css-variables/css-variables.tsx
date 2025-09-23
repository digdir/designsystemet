import { Table } from '@digdir/designsystemet-react';
import cl from 'clsx';
import { forwardRef } from 'react';

type CssVariablesProps = {
  vars: {
    [key: string]: string;
  };
} & React.HTMLAttributes<HTMLTableElement>;

export const CssVariables = forwardRef<HTMLTableElement, CssVariablesProps>(
  function CssVariables({ vars, className, ...rest }, ref) {
    return (
      <Table
        zebra
        className={cl('component-table', className)}
        data-color='accent'
        border
        style={{
          tableLayout: 'fixed',
        }}
        {...rest}
        ref={ref}
      >
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {Object.entries(vars).map(([name, value]) => (
            <Table.Row key={name}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{value}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
);

/* get variables and its value from css file */
export function getCssVariables(css: string) {
  const res: { [key: string]: string } = {};

  // temporarily remove inline strings, as they may contain ; and } characters
  // and thus ruin the matching for property declarations
  const stringsRemovedFromCss = Array.from(css.matchAll(/"[^"]*"/g)).map(
    (x) => x[0],
  );
  const cssWithRemovedStrings = stringsRemovedFromCss.reduce(
    (prev, curr, idx) => prev.replace(curr, `<placeholder-${idx}>`),
    css,
  );
  // get all --dsc-* property declarations
  const cssVars = Array.from(
    cssWithRemovedStrings.matchAll(/(?<!var\()(--dsc-[^;}]+)[;}]/g),
  ).map((matches) => matches[1]);

  /* Iterate over the CSS properties */
  for (const declaration of cssVars) {
    const [name, value] = declaration.split(':');
    // Choose the earliest declaration of the property.
    // We assume later declarations are part of a sub-selector.
    if (!res[name]) {
      // Return the original inline string from the value, if it was removed earlier
      const valueWithOriginalString = value.replace(
        /<placeholder-(\d+)>/,
        (_, p1: string) => stringsRemovedFromCss[parseInt(p1, 10)],
      );
      res[name] = valueWithOriginalString;
    }
  }

  return res;
}
