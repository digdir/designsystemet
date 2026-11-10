import {
  EXPERIMENTAL_Chart,
  Table,
  ToggleGroup,
} from '@digdir/designsystemet-react';

// Example data is inspired by the kind of statistics published on ssb.no, but all numbers are made up

export const Preview = () => (
  <EXPERIMENTAL_Chart data-variant='column'>
    <Table>
      <caption>Nye personbiler etter drivstoff</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>Elbil</Table.HeaderCell>
          <Table.HeaderCell>Ladbar hybrid</Table.HeaderCell>
          <Table.HeaderCell>Bensin og diesel</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2021</Table.HeaderCell>
          <Table.Cell>96&nbsp;500</Table.Cell>
          <Table.Cell>38&nbsp;200</Table.Cell>
          <Table.Cell>28&nbsp;400</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>121&nbsp;000</Table.Cell>
          <Table.Cell>24&nbsp;600</Table.Cell>
          <Table.Cell>17&nbsp;900</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>108&nbsp;300</Table.Cell>
          <Table.Cell>13&nbsp;100</Table.Cell>
          <Table.Cell>11&nbsp;200</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>126&nbsp;700</Table.Cell>
          <Table.Cell>8&nbsp;900</Table.Cell>
          <Table.Cell>6&nbsp;300</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Cell colSpan={4}>
            Eksempeldata inspirert av statistikk fra ssb.no
          </Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const Line = () => (
  <EXPERIMENTAL_Chart data-variant='line'>
    <Table>
      <caption>Arbeidsledige etter alder, prosent av arbeidsstyrken</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>15–24 år</Table.HeaderCell>
          <Table.HeaderCell>25–54 år</Table.HeaderCell>
          <Table.HeaderCell>55–74 år</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2021</Table.HeaderCell>
          <Table.Cell>12,4</Table.Cell>
          <Table.Cell>4,1</Table.Cell>
          <Table.Cell>2,2</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>10,1</Table.Cell>
          <Table.Cell>3,0</Table.Cell>
          <Table.Cell>1,6</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>10,8</Table.Cell>
          <Table.Cell>3,2</Table.Cell>
          <Table.Cell>1,5</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>11,9</Table.Cell>
          <Table.Cell>3,6</Table.Cell>
          <Table.Cell>1,8</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>11,3</Table.Cell>
          <Table.Cell>3,4</Table.Cell>
          <Table.Cell>1,9</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const Bar = () => (
  <EXPERIMENTAL_Chart data-variant='bar'>
    <Table>
      <caption>Jobber etter næring, i tusen</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Næring</Table.HeaderCell>
          <Table.HeaderCell>Kvinner</Table.HeaderCell>
          <Table.HeaderCell>Menn</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>
            Helse- og sosialtjenester
          </Table.HeaderCell>
          <Table.Cell>438</Table.Cell>
          <Table.Cell>126</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Varehandel</Table.HeaderCell>
          <Table.Cell>171</Table.Cell>
          <Table.Cell>188</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>
            Bygge- og anleggsvirksomhet
          </Table.HeaderCell>
          <Table.Cell>27</Table.Cell>
          <Table.Cell>229</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Undervisning</Table.HeaderCell>
          <Table.Cell>149</Table.Cell>
          <Table.Cell>84</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Industri</Table.HeaderCell>
          <Table.Cell>58</Table.Cell>
          <Table.Cell>163</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const Stacked = () => (
  <EXPERIMENTAL_Chart data-variant='column' data-stacked>
    <Table>
      <caption>Kollektivreiser etter transportmiddel, millioner</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>Buss</Table.HeaderCell>
          <Table.HeaderCell>T-bane og trikk</Table.HeaderCell>
          <Table.HeaderCell>Tog</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2021</Table.HeaderCell>
          <Table.Cell>248</Table.Cell>
          <Table.Cell>116</Table.Cell>
          <Table.Cell>43</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>312</Table.Cell>
          <Table.Cell>161</Table.Cell>
          <Table.Cell>66</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>341</Table.Cell>
          <Table.Cell>183</Table.Cell>
          <Table.Cell>77</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>356</Table.Cell>
          <Table.Cell>192</Table.Cell>
          <Table.Cell>82</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const ShowValues = () => (
  <EXPERIMENTAL_Chart data-variant='column' data-show-values>
    <Table>
      <caption>Overnattinger om sommeren, millioner</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Måned</Table.HeaderCell>
          <Table.HeaderCell>Hotell</Table.HeaderCell>
          <Table.HeaderCell>Camping</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>Juni</Table.HeaderCell>
          <Table.Cell>2,4</Table.Cell>
          <Table.Cell>1,3</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Juli</Table.HeaderCell>
          <Table.Cell>3,2</Table.Cell>
          <Table.Cell>2,7</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>August</Table.HeaderCell>
          <Table.Cell>2,8</Table.Cell>
          <Table.Cell>1,8</Table.Cell>
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
      <caption>Fullførte boliger etter bygningstype</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>År</Table.HeaderCell>
          <Table.HeaderCell>Enebolig</Table.HeaderCell>
          <Table.HeaderCell>Rekkehus</Table.HeaderCell>
          <Table.HeaderCell>Blokk</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2021</Table.HeaderCell>
          <Table.Cell>6&nbsp;200</Table.Cell>
          <Table.Cell>5&nbsp;400</Table.Cell>
          <Table.Cell>14&nbsp;800</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>5&nbsp;800</Table.Cell>
          <Table.Cell>5&nbsp;900</Table.Cell>
          <Table.Cell>15&nbsp;900</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>5&nbsp;100</Table.Cell>
          <Table.Cell>5&nbsp;000</Table.Cell>
          <Table.Cell>13&nbsp;200</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>4&nbsp;300</Table.Cell>
          <Table.Cell>4&nbsp;100</Table.Cell>
          <Table.Cell>10&nbsp;400</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const PreviewEn = () => (
  <EXPERIMENTAL_Chart data-variant='column'>
    <Table>
      <caption>New passenger cars by fuel type</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Electric</Table.HeaderCell>
          <Table.HeaderCell>Plug-in hybrid</Table.HeaderCell>
          <Table.HeaderCell>Petrol and diesel</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2021</Table.HeaderCell>
          <Table.Cell>96,500</Table.Cell>
          <Table.Cell>38,200</Table.Cell>
          <Table.Cell>28,400</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>121,000</Table.Cell>
          <Table.Cell>24,600</Table.Cell>
          <Table.Cell>17,900</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>108,300</Table.Cell>
          <Table.Cell>13,100</Table.Cell>
          <Table.Cell>11,200</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>126,700</Table.Cell>
          <Table.Cell>8,900</Table.Cell>
          <Table.Cell>6,300</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Cell colSpan={4}>
            Example data inspired by statistics from ssb.no
          </Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const LineEn = () => (
  <EXPERIMENTAL_Chart data-variant='line'>
    <Table>
      <caption>Unemployment by age, per cent of the labour force</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>15–24 years</Table.HeaderCell>
          <Table.HeaderCell>25–54 years</Table.HeaderCell>
          <Table.HeaderCell>55–74 years</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2021</Table.HeaderCell>
          <Table.Cell>12.4</Table.Cell>
          <Table.Cell>4.1</Table.Cell>
          <Table.Cell>2.2</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>10.1</Table.Cell>
          <Table.Cell>3.0</Table.Cell>
          <Table.Cell>1.6</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>10.8</Table.Cell>
          <Table.Cell>3.2</Table.Cell>
          <Table.Cell>1.5</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>11.9</Table.Cell>
          <Table.Cell>3.6</Table.Cell>
          <Table.Cell>1.8</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell>11.3</Table.Cell>
          <Table.Cell>3.4</Table.Cell>
          <Table.Cell>1.9</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const BarEn = () => (
  <EXPERIMENTAL_Chart data-variant='bar'>
    <Table>
      <caption>Jobs by industry, in thousands</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Industry</Table.HeaderCell>
          <Table.HeaderCell>Women</Table.HeaderCell>
          <Table.HeaderCell>Men</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>
            Health and social work
          </Table.HeaderCell>
          <Table.Cell>438</Table.Cell>
          <Table.Cell>126</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Retail trade</Table.HeaderCell>
          <Table.Cell>171</Table.Cell>
          <Table.Cell>188</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Construction</Table.HeaderCell>
          <Table.Cell>27</Table.Cell>
          <Table.Cell>229</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Education</Table.HeaderCell>
          <Table.Cell>149</Table.Cell>
          <Table.Cell>84</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Manufacturing</Table.HeaderCell>
          <Table.Cell>58</Table.Cell>
          <Table.Cell>163</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const StackedEn = () => (
  <EXPERIMENTAL_Chart data-variant='column' data-stacked>
    <Table>
      <caption>Public transport journeys by mode, millions</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Bus</Table.HeaderCell>
          <Table.HeaderCell>Metro and tram</Table.HeaderCell>
          <Table.HeaderCell>Train</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2021</Table.HeaderCell>
          <Table.Cell>248</Table.Cell>
          <Table.Cell>116</Table.Cell>
          <Table.Cell>43</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>312</Table.Cell>
          <Table.Cell>161</Table.Cell>
          <Table.Cell>66</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>341</Table.Cell>
          <Table.Cell>183</Table.Cell>
          <Table.Cell>77</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>356</Table.Cell>
          <Table.Cell>192</Table.Cell>
          <Table.Cell>82</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);

export const ShowValuesEn = () => (
  <EXPERIMENTAL_Chart data-variant='column' data-show-values>
    <Table>
      <caption>Guest nights in summer, millions</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Month</Table.HeaderCell>
          <Table.HeaderCell>Hotels</Table.HeaderCell>
          <Table.HeaderCell>Camping</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>June</Table.HeaderCell>
          <Table.Cell>2.4</Table.Cell>
          <Table.Cell>1.3</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>July</Table.HeaderCell>
          <Table.Cell>3.2</Table.Cell>
          <Table.Cell>2.7</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>August</Table.HeaderCell>
          <Table.Cell>2.8</Table.Cell>
          <Table.Cell>1.8</Table.Cell>
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
      <caption>Completed dwellings by type of building</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Detached house</Table.HeaderCell>
          <Table.HeaderCell>Row house</Table.HeaderCell>
          <Table.HeaderCell>Block of flats</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2021</Table.HeaderCell>
          <Table.Cell>6,200</Table.Cell>
          <Table.Cell>5,400</Table.Cell>
          <Table.Cell>14,800</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2022</Table.HeaderCell>
          <Table.Cell>5,800</Table.Cell>
          <Table.Cell>5,900</Table.Cell>
          <Table.Cell>15,900</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2023</Table.HeaderCell>
          <Table.Cell>5,100</Table.Cell>
          <Table.Cell>5,000</Table.Cell>
          <Table.Cell>13,200</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>4,300</Table.Cell>
          <Table.Cell>4,100</Table.Cell>
          <Table.Cell>10,400</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </EXPERIMENTAL_Chart>
);
