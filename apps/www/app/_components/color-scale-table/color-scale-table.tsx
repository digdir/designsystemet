import { colorNames } from '@digdir/designsystemet/color';
import { Table, type TableProps } from '@digdir/designsystemet-react';

export type ColorScaleTableProps = TableProps;

export const ColorScaleTable = ({ ...rest }: ColorScaleTableProps) => {
  return (
    <Table border zebra {...rest}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Color name</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {colorNames.map((colorName) => (
          <Table.Row key={colorName}>
            <Table.Cell>{colorName}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
