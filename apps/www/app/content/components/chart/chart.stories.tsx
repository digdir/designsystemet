import {
  EXPERIMENTAL_Chart,
  Table,
  ToggleGroup,
} from '@digdir/designsystemet-react';

export const Preview = () => (
  <EXPERIMENTAL_Chart data-variant='column'>
    <Table>
      <caption>Søknader per år</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>Innvilget</Table.HeaderCell>
          <Table.HeaderCell>Avslått</Table.HeaderCell>
          <Table.HeaderCell>Trukket</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1&nbsp;240</Table.Cell>
          <Table.Cell>310</Table.Cell>
          <Table.Cell>95</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1&nbsp;480</Table.Cell>
          <Table.Cell>290</Table.Cell>
          <Table.Cell>120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1&nbsp;310</Table.Cell>
          <Table.Cell>420</Table.Cell>
          <Table.Cell>80</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1&nbsp;720</Table.Cell>
          <Table.Cell>380</Table.Cell>
          <Table.Cell>140</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const Line = () => (
  <EXPERIMENTAL_Chart data-variant='line'>
    <Table>
      <caption>Søknader per år</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>Innvilget</Table.HeaderCell>
          <Table.HeaderCell>Avslått</Table.HeaderCell>
          <Table.HeaderCell>Trukket</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1&nbsp;240</Table.Cell>
          <Table.Cell>310</Table.Cell>
          <Table.Cell>95</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1&nbsp;480</Table.Cell>
          <Table.Cell>290</Table.Cell>
          <Table.Cell>120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1&nbsp;310</Table.Cell>
          <Table.Cell>420</Table.Cell>
          <Table.Cell>80</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1&nbsp;720</Table.Cell>
          <Table.Cell>380</Table.Cell>
          <Table.Cell>140</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const Bar = () => (
  <EXPERIMENTAL_Chart data-variant='bar'>
    <Table>
      <caption>Søknader per år</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>Innvilget</Table.HeaderCell>
          <Table.HeaderCell>Avslått</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1&nbsp;240</Table.Cell>
          <Table.Cell>310</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1&nbsp;480</Table.Cell>
          <Table.Cell>290</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1&nbsp;310</Table.Cell>
          <Table.Cell>420</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1&nbsp;720</Table.Cell>
          <Table.Cell>380</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const Stacked = () => (
  <EXPERIMENTAL_Chart data-variant='column' data-stacked>
    <Table>
      <caption>Søknader per år</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>Innvilget</Table.HeaderCell>
          <Table.HeaderCell>Avslått</Table.HeaderCell>
          <Table.HeaderCell>Trukket</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1&nbsp;240</Table.Cell>
          <Table.Cell>310</Table.Cell>
          <Table.Cell>95</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1&nbsp;480</Table.Cell>
          <Table.Cell>290</Table.Cell>
          <Table.Cell>120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1&nbsp;310</Table.Cell>
          <Table.Cell>420</Table.Cell>
          <Table.Cell>80</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1&nbsp;720</Table.Cell>
          <Table.Cell>380</Table.Cell>
          <Table.Cell>140</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const ShowValues = () => (
  <EXPERIMENTAL_Chart data-variant='column' data-show-values>
    <Table>
      <caption>Søknader per år</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>Innvilget</Table.HeaderCell>
          <Table.HeaderCell>Avslått</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1&nbsp;240</Table.Cell>
          <Table.Cell>310</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1&nbsp;480</Table.Cell>
          <Table.Cell>290</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1&nbsp;310</Table.Cell>
          <Table.Cell>420</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1&nbsp;720</Table.Cell>
          <Table.Cell>380</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const TableToggle = () => (
  <EXPERIMENTAL_Chart data-variant='column'>
    <ToggleGroup
      aria-label='Visning'
      data-chart='variant'
      defaultValue='column'
    >
      <ToggleGroup.Item value='column'>Diagram</ToggleGroup.Item>
      <ToggleGroup.Item value='table'>Tabell</ToggleGroup.Item>
    </ToggleGroup>
    <Table>
      <caption>Søknader per år</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>Innvilget</Table.HeaderCell>
          <Table.HeaderCell>Avslått</Table.HeaderCell>
          <Table.HeaderCell>Trukket</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1&nbsp;240</Table.Cell>
          <Table.Cell>310</Table.Cell>
          <Table.Cell>95</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1&nbsp;480</Table.Cell>
          <Table.Cell>290</Table.Cell>
          <Table.Cell>120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1&nbsp;310</Table.Cell>
          <Table.Cell>420</Table.Cell>
          <Table.Cell>80</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1&nbsp;720</Table.Cell>
          <Table.Cell>380</Table.Cell>
          <Table.Cell>140</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const PreviewEn = () => (
  <EXPERIMENTAL_Chart data-variant='column'>
    <Table>
      <caption>Applications per year</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Granted</Table.HeaderCell>
          <Table.HeaderCell>Rejected</Table.HeaderCell>
          <Table.HeaderCell>Withdrawn</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1,240</Table.Cell>
          <Table.Cell>310</Table.Cell>
          <Table.Cell>95</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1,480</Table.Cell>
          <Table.Cell>290</Table.Cell>
          <Table.Cell>120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1,310</Table.Cell>
          <Table.Cell>420</Table.Cell>
          <Table.Cell>80</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1,720</Table.Cell>
          <Table.Cell>380</Table.Cell>
          <Table.Cell>140</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const LineEn = () => (
  <EXPERIMENTAL_Chart data-variant='line'>
    <Table>
      <caption>Applications per year</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Granted</Table.HeaderCell>
          <Table.HeaderCell>Rejected</Table.HeaderCell>
          <Table.HeaderCell>Withdrawn</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1,240</Table.Cell>
          <Table.Cell>310</Table.Cell>
          <Table.Cell>95</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1,480</Table.Cell>
          <Table.Cell>290</Table.Cell>
          <Table.Cell>120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1,310</Table.Cell>
          <Table.Cell>420</Table.Cell>
          <Table.Cell>80</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1,720</Table.Cell>
          <Table.Cell>380</Table.Cell>
          <Table.Cell>140</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const BarEn = () => (
  <EXPERIMENTAL_Chart data-variant='bar'>
    <Table>
      <caption>Applications per year</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Granted</Table.HeaderCell>
          <Table.HeaderCell>Rejected</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1,240</Table.Cell>
          <Table.Cell>310</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1,480</Table.Cell>
          <Table.Cell>290</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1,310</Table.Cell>
          <Table.Cell>420</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1,720</Table.Cell>
          <Table.Cell>380</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const StackedEn = () => (
  <EXPERIMENTAL_Chart data-variant='column' data-stacked>
    <Table>
      <caption>Applications per year</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Granted</Table.HeaderCell>
          <Table.HeaderCell>Rejected</Table.HeaderCell>
          <Table.HeaderCell>Withdrawn</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1,240</Table.Cell>
          <Table.Cell>310</Table.Cell>
          <Table.Cell>95</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1,480</Table.Cell>
          <Table.Cell>290</Table.Cell>
          <Table.Cell>120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1,310</Table.Cell>
          <Table.Cell>420</Table.Cell>
          <Table.Cell>80</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1,720</Table.Cell>
          <Table.Cell>380</Table.Cell>
          <Table.Cell>140</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const ShowValuesEn = () => (
  <EXPERIMENTAL_Chart data-variant='column' data-show-values>
    <Table>
      <caption>Applications per year</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Granted</Table.HeaderCell>
          <Table.HeaderCell>Rejected</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1,240</Table.Cell>
          <Table.Cell>310</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1,480</Table.Cell>
          <Table.Cell>290</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1,310</Table.Cell>
          <Table.Cell>420</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1,720</Table.Cell>
          <Table.Cell>380</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const TableToggleEn = () => (
  <EXPERIMENTAL_Chart data-variant='column'>
    <ToggleGroup aria-label='View' data-chart='variant' defaultValue='column'>
      <ToggleGroup.Item value='column'>Chart</ToggleGroup.Item>
      <ToggleGroup.Item value='table'>Table</ToggleGroup.Item>
    </ToggleGroup>
    <Table>
      <caption>Applications per year</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Granted</Table.HeaderCell>
          <Table.HeaderCell>Rejected</Table.HeaderCell>
          <Table.HeaderCell>Withdrawn</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>1,240</Table.Cell>
          <Table.Cell>310</Table.Cell>
          <Table.Cell>95</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>1,480</Table.Cell>
          <Table.Cell>290</Table.Cell>
          <Table.Cell>120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>1,310</Table.Cell>
          <Table.Cell>420</Table.Cell>
          <Table.Cell>80</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>1,720</Table.Cell>
          <Table.Cell>380</Table.Cell>
          <Table.Cell>140</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);
