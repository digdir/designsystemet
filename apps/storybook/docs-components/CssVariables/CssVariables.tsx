import { Table } from '@digdir/designsystemet-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

type CssVariablesProps = {
  css: string;
};

export const CssVariables: React.FC<CssVariablesProps> = ({ css }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [cssVariables, setCssVariables] = useState<{ [key: string]: string }>(
    {},
  );

  useEffect(() => {
    const res = getCssVariables(css || '');

    setCssVariables(res);
  }, [targetRef]);

  return (
    <Table zebra>
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
};

/* get variables and its value from css file */
function getCssVariables(css: string) {
  const res: { [key: string]: string } = {};
  /* first, get only the first css block contained in {} */
  const cssBlock = css.match(/(?<={)([^}]*)/)?.[0];
  if (!cssBlock) {
    return res;
  }

  /* then get all variables with --dsc */
  const variables = cssBlock.match(/--dsc[^;]+/g);

  if (!variables) {
    return res;
  }

  /* get the value of each variable */
  for (const variable of variables) {
    const [name, value] = variable.split(':');
    res[name] = value.trim();
  }

  return res;
}
