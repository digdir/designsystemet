import {
  Fieldset,
  Heading,
  Paragraph,
  Radio,
  Textfield,
} from '@digdir/designsystemet-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import classes from './roi-calculator.module.css';

const MAN_HOURS_PER_YEAR = 1695;

export default function RoiCalculator() {
  const { t } = useTranslation();
  const { lang } = useRouteLoaderData('root');

  const [newSolutions, setNewSolutions] = useState(4);
  const [numberOfDevs, setNumberOfDevs] = useState(2);
  const [usageFactor, setUsageFactor] = useState(0.25);

  // formel: antall årsverk (lagt inn 2)* 1695 * antall løsninger *0,25 (0,35)
  const savingsFormula = (devsPerSolution: number, numberOfSolutions: number) =>
    devsPerSolution * MAN_HOURS_PER_YEAR * numberOfSolutions * usageFactor;

  const savedHours = savingsFormula(numberOfDevs, newSolutions);

  return (
    <div className={classes.roiCalculator}>
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
            hours: savedHours.toLocaleString(lang, {
              maximumFractionDigits: 0,
            }),
            /* round to nearest first decimal */
            years: Math.round((savedHours / MAN_HOURS_PER_YEAR) * 10) / 10,
          })}
        </Heading>
      </div>
    </div>
  );
}
