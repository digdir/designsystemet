import { Table } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { forwardRef, useEffect, useState } from 'react';

type CssVariablesProps = {
  css: string;
} & React.HTMLAttributes<HTMLTableElement>;

export const CssVariables = forwardRef<HTMLTableElement, CssVariablesProps>(
  function CssVariables({ css, className, ...rest }, ref) {
    const [cssVariables, setCssVariables] = useState<{ [key: string]: string }>(
      {},
    );

    useEffect(() => {
      setCssVariables(getCssVariables(css || ''));
    }, [css, setCssVariables]);

    return (
      <Table
        zebra
        data-color-scheme='light'
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
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {Object.entries(cssVariables).map(([name, value]) => (
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
function getCssVariables(css: string) {
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
        (_, p1: string) => stringsRemovedFromCss[parseInt(p1)],
      );
      res[name] = valueWithOriginalString;
    }
  }

  return res;
}
