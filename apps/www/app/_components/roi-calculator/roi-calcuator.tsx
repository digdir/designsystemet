import {
  Fieldset,
  Heading,
  Paragraph,
  Radio,
  Textfield,
} from '@digdir/designsystemet-react';
import { useState } from 'react';
import classes from './roi-calculator.module.css';

export default function RoiCalculator() {
  const [newSolutions, setNewSolutions] = useState(4);
  const [numberOfDevs, setNumberOfDevs] = useState(2);
  const [usageFactor, setUsageFactor] = useState(0.25);

  // formel: antall årsverk (lagt inn 2)* 1695 * antall løsninger *0,25 (0,35)
  const savingsFormula = (devsPerSolution: number, numberOfSolutions: number) =>
    devsPerSolution * 1695 * numberOfSolutions * usageFactor;

  const savedHours = savingsFormula(numberOfDevs, newSolutions).toLocaleString(
    'no-NO',
    {
      maximumFractionDigits: 0,
    },
  );

  return (
    <div className={classes.roiCalculator} data-wide-content>
      <Heading>Hva kan din virksomhet spare?</Heading>
      <Paragraph>
        Generell tekst om at du kan spare ulikt basert på om du skal bruke det
        direkte eller bygge på toppen.
      </Paragraph>

      <Fieldset>
        <Radio
          name='usage'
          label='Jeg skal bruke det direkte i løsninger'
          value='0.25'
          onChange={() => setUsageFactor(0.25)}
          defaultChecked
        />
        <Radio
          name='usage'
          label='Jeg skal bygge eget Designsystem på toppen av Designsystemet'
          value='0.35'
          onChange={() => setUsageFactor(0.35)}
        />
      </Fieldset>

      <Paragraph>
        Vi har utgangspunkt i at hver løsning har 1 frontend-ressurs og 1
        designressurs, og at de sparer 25% tid på design og frontend per
        løsning. Se grunnlaget for beregningen.
      </Paragraph>

      <div className={classes.inputGrid}>
        <Textfield
          label='Antall nye løsninger per år'
          suffix='nye løsninger per år'
          type='number'
          defaultValue={4}
          value={newSolutions}
          onChange={(e) => setNewSolutions(Number(e.target.value))}
          size={3}
          name='number-of-solutions'
        />
        <Textfield
          label='Antall årsverk på design og frontend per løsning'
          suffix='årsverk design/frontend per løsning'
          type='number'
          defaultValue={2}
          value={numberOfDevs}
          onChange={(e) => setNumberOfDevs(Number(e.target.value))}
          size={3}
          name='number-of-devs-per-solution'
        />
      </div>

      <div className={classes.result}>
        <Heading level={3}>
          Virksomheten får frigjort {savedHours} timer per år ({numberOfDevs}{' '}
          årsverk)
        </Heading>
      </div>
    </div>
  );
}
