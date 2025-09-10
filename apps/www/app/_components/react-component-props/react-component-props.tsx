import { Table } from '@digdir/designsystemet-react';
import { forwardRef, type HTMLAttributes } from 'react';
import type { ComponentDoc } from 'react-docgen-typescript';

type ReactComponentProps = {
  docs: ComponentDoc[];
} & HTMLAttributes<HTMLDivElement>;

//TODO: this is a temporary markup while we figure out how the props listing should look
export const ReactComponentDocs = forwardRef<
  HTMLTableElement,
  ReactComponentProps
>(function CssVariables({ docs, ...rest }, ref) {
  console.log(docs);
  return (
    <div {...rest} ref={ref}>
      {docs?.length
        ? docs
            .filter((doc) => Object.keys(doc.props).length > 0)
            .map((doc) => (
              <Table
                key={doc.displayName}
                zebra
                style={{
                  tableLayout: 'fixed',
                  marginBottom: '4rem',
                }}
              >
                <caption>{doc.displayName}</caption>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Default</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {Object.entries(doc.props).map(([name, prop]) => (
                    <Table.Row key={name}>
                      <Table.Cell>{name}</Table.Cell>
                      <Table.Cell>{prop.description}</Table.Cell>
                      <Table.Cell>{prop.defaultValue?.value}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ))
        : null}
    </div>
  );
});
