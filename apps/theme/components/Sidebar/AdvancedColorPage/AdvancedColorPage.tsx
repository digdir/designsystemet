import {
  Button,
  Field,
  Heading,
  Label,
  Select,
} from '@digdir/designsystemet-react';
import { ChevronLeftIcon, FlowerIcon } from '@navikt/aksel-icons';
import { LightnessInput } from '../../LightnessInput/LightnessInput';
import classes from './AdvancedColorPage.module.css';

type AdvancedColorPageProps = {
  onBackClicked: () => void;
  name?: string;
  color?: string;
  index: number;
  colorType: 'main' | 'neutral' | 'support';
};

export const AdvancedColorPage = ({
  onBackClicked,
  name,
  color,
  index,
  colorType,
}: AdvancedColorPageProps) => {
  return (
    <div>
      <Button
        data-size='sm'
        variant='tertiary'
        onClick={() => {
          onBackClicked();
        }}
        className={classes.back}
      >
        <ChevronLeftIcon aria-hidden fontSize='1.5rem' /> Gå tilbake
      </Button>
      <div className={classes.preview}>
        <div className={classes.color} style={{ backgroundColor: color }}></div>
        <div className={classes.colorName}>{name}</div>
      </div>
      <Heading data-size='xs' className={classes.heading}>
        Avanserte fargeinnstillinger
      </Heading>

      <Field data-size='sm' className={classes.field}>
        <Label>Velg interpolering</Label>
        <Select defaultValue='rgb' width='full'>
          <Select.Option value='rgb'>RGB</Select.Option>
          <Select.Option value='oklch'>OKLCH</Select.Option>
          <Select.Option value='hsl'>HSL</Select.Option>
        </Select>
      </Field>

      <div className={classes.group}>
        <Heading data-size='2xs'>Fargemetning</Heading>

        <button className={classes.btn}>
          <FlowerIcon title='a11y-title' fontSize='1.5rem' />
          Velg fargemetning for fargene
        </button>
      </div>

      <div className={classes.group}>
        <Heading data-size='2xs'>Base lightness i lys modus</Heading>

        <LightnessInput
          label='Base Hover'
          handleReset={() => {}}
          initialValue={50}
        />

        <LightnessInput
          label='Base Active'
          handleReset={() => {}}
          initialValue={50}
        />
      </div>

      <div className={classes.group}>
        <Heading data-size='2xs'>Base lightness i mørk modus</Heading>

        <LightnessInput
          label='Base Default'
          handleReset={() => {}}
          initialValue={50}
        />

        <LightnessInput
          label='Base Hover'
          handleReset={() => {}}
          initialValue={50}
        />

        <LightnessInput
          label='Base Active'
          handleReset={() => {}}
          initialValue={50}
        />
      </div>
    </div>
  );
};
