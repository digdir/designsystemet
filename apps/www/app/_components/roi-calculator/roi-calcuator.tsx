import {
  Fieldset,
  Heading,
  Paragraph,
  Radio,
  Textfield,
} from '@digdir/designsystemet-react';
import classes from './roi-calculator.module.css';

export default function RoiCalculator() {
  return (
    <div className={classes.roiCalculator}>
      <Heading>Hva kan din virksomhet spare?</Heading>
      <Paragraph>
        Generell tekst om at du kan spare ulikt basert på om du skal bruke det
        direkte eller bygge på toppen.
      </Paragraph>

      <Fieldset>
        <Radio name='usage' label='Jeg skal bruke det direkte i løsninger' />
        <Radio
          name='usage'
          label='Jeg skal bygge eget Designsystem på toppen av Designsystemet'
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
          defaultValue={10}
        />
        <Textfield
          label='Antall årsverk på design og frontend per løsning'
          suffix='årsverk design/frontend per løsning'
          type='number'
          defaultValue={2}
        />
      </div>
    </div>
  );
}
