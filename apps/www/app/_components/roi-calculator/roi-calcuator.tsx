import {
  Fieldset,
  Heading,
  Paragraph,
  Radio,
  Textfield,
} from '@digdir/designsystemet-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './roi-calculator.module.css';

export default function RoiCalculator() {
  const { t } = useTranslation();

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
      <Heading>{t('roi-calculator.title')}</Heading>
      <Paragraph>{t('roi-calculator.description')}</Paragraph>

      <Fieldset>
        <Fieldset.Legend>{t('roi-calculator.usageLegend')}</Fieldset.Legend>
        <Radio
          name='usage'
          label={t('roi-calculator.radios.direct')}
          value='0.25'
          onChange={() => setUsageFactor(0.25)}
          defaultChecked
        />
        <Radio
          name='usage'
          label={t('roi-calculator.radios.build')}
          value='0.35'
          onChange={() => setUsageFactor(0.35)}
        />
      </Fieldset>

      <Paragraph>{t('roi-calculator.whereDataIsFrom')}</Paragraph>

      <div className={classes.inputGrid}>
        <Textfield
          label={t('roi-calculator.inputs.newSolutions.label')}
          suffix={t('roi-calculator.inputs.newSolutions.suffix')}
          type='number'
          defaultValue={4}
          value={newSolutions}
          onChange={(e) => setNewSolutions(Number(e.target.value))}
          name='number-of-solutions'
        />
        <Textfield
          label={t('roi-calculator.inputs.numberOfDevs.label')}
          suffix={t('roi-calculator.inputs.numberOfDevs.suffix')}
          type='number'
          defaultValue={2}
          value={numberOfDevs}
          onChange={(e) => setNumberOfDevs(Number(e.target.value))}
          name='number-of-devs-per-solution'
        />
      </div>

      <div className={classes.result}>
        <Heading level={3}>
          {t('roi-calculator.savedHours', {
            hours: savedHours,
            years: numberOfDevs,
          })}
        </Heading>
      </div>
    </div>
  );
}
