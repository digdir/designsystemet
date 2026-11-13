import { semanticColorSpec } from '@digdir/designsystemet/internal';
import { Table } from '@digdir/designsystemet-react';
import { Fragment, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const specSteps = Object.values(semanticColorSpec);
const groups = [...new Set(specSteps.map((step) => step.group))];

type ContrastRequirement = NonNullable<
  (typeof specSteps)[number]['minContrast']
>[number];

export const ColorInfoTable = () => {
  const { t } = useTranslation();

  return (
    <Table data-color='neutral' zebra border style={{ margin: '2rem 0' }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>{t('color-info-table.name')}</Table.HeaderCell>
          <Table.HeaderCell>{t('color-info-table.usage')}</Table.HeaderCell>
          <Table.HeaderCell>{t('color-info-table.contrast')}</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {specSteps.map((item) => {
          return (
            <Table.Row key={item.name}>
              <Table.Cell>{item.number + '. ' + item.name}</Table.Cell>
              <Table.Cell>{t(`color-metadata.${item.name}.short`)}</Table.Cell>
              <Table.Cell>
                {item.minContrast?.map((requirement) => (
                  <ContrastRequirementText
                    key={requirement.ratio}
                    requirement={requirement}
                  />
                )) ?? '–'}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

/**
 * E.g. "4.5:1 against all background colors, surface-default and surface-tinted".
 * Groups where every step is included are shortened to "all <group> colors".
 */
const ContrastRequirementText = ({
  requirement: { ratio, against },
}: {
  requirement: ContrastRequirement;
}) => {
  const { t, i18n } = useTranslation();

  const items: ReactNode[] = [];
  for (const group of groups) {
    const stepsInGroup = specSteps.filter((step) => step.group === group);
    const included = stepsInGroup.filter(({ name }) => against.includes(name));
    if (included.length > 1 && included.length === stepsInGroup.length) {
      items.push(t('color-info-table.all-in-group', { group }));
    } else {
      items.push(...included.map(({ name }) => <code key={name}>{name}</code>));
    }
  }

  // Format placeholders, then swap them for the items, so names can be wrapped in <code>
  const parts = new Intl.ListFormat(i18n.language, {
    type: 'conjunction',
  }).formatToParts(items.map((_, index) => String(index)));

  return (
    <p style={{ margin: 0 }}>
      {t('color-info-table.contrast-against', { ratio })}{' '}
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part.type === 'element' ? items[Number(part.value)] : part.value}
        </Fragment>
      ))}
    </p>
  );
};
