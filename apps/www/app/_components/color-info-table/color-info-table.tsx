import { semanticColorSpec } from '@digdir/designsystemet/color';
import { Table } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';

export const ColorInfoTable = () => {
  const { t } = useTranslation();

  return (
    <Table data-color='neutral' zebra border style={{ margin: '2rem 0' }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>{t('color-info-table.name')}</Table.HeaderCell>
          <Table.HeaderCell>{t('color-info-table.usage')}</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {Object.values(semanticColorSpec).map((item) => {
          return (
            <Table.Row key={item.name}>
              <Table.Cell>{item.number + '. ' + item.name}</Table.Cell>
              <Table.Cell>{t(`color-metadata.${item.name}.short`)}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
