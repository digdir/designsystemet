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
      const res = getCssVariables(css || '');

      setCssVariables(res);
    }, []);

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

  /* get first block of css */
  const cssBlock = css.match(/(?<={)([^}]*)/)?.[0];
  if (!cssBlock) {
    return res;
  }

  /* Create a temporary element */
  const tempElement = document.createElement('div');
  tempElement.style.cssText = cssBlock;

  /* Iterate over the CSS properties */
  for (let i = 0; i < tempElement.style.length; i++) {
    const name = tempElement.style[i];
    if (name.startsWith('--dsc')) {
      res[name] = tempElement.style.getPropertyValue(name).trim();
    }
  }

  return res;
}
