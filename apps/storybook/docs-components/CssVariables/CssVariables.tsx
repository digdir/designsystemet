import { Table } from '@digdir/designsystemet-react';
import { Slot } from '@radix-ui/react-slot';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

type CssVariablesProps = {
  children: React.ReactNode;
};

export const CssVariables: React.FC<CssVariablesProps> = ({ children }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [cssVariables, setCssVariables] = useState<{ [key: string]: string }>(
    {},
  );

  useEffect(() => {
    const elem = targetRef.current;
    if (!elem) return;
    const res: { [key: string]: string } = {};
    if ('computedStyleMap' in elem) {
      // Chrome
      const styles = elem.computedStyleMap();
      for (const [prop, val] of Array.from(styles)) {
        if (prop.startsWith('--dsc')) {
          res[prop] = val.toString();
        }
      }
    } else {
      // Firefox
      const styles = getComputedStyle(elem);
      for (let i = 0; i < styles.length; i++) {
        const propertyName = styles[i];
        if (propertyName.startsWith('--dsc')) {
          const value = styles.getPropertyValue(propertyName);
          res[propertyName] = value;
        }
      }
    }

    setCssVariables(res);
  }, [targetRef]);

  return (
    <>
      <Slot hidden ref={targetRef}>
        {children}
      </Slot>
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
    </>
  );
};
