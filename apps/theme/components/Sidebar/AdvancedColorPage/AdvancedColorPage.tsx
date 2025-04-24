import {
  Button,
  Field,
  Heading,
  Label,
  Select,
} from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import classes from './AdvancedColorPage.module.css';

type AdvancedColorPageProps = {
  onBackClicked: () => void;
  onLightStaticSaturation: (saturation: number) => void;
};

export const AdvancedColorPage = ({
  onBackClicked,
  onLightStaticSaturation,
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
      <Heading data-size='xs' className={classes.heading}>
        Avanserte fargeinnstillinger
      </Heading>

      <Field data-size='sm'>
        <Label>Stegvis økning av base fargene</Label>
        <Select defaultValue='8' width='full'>
          <Select.Option value='1.1'>4</Select.Option>
          <Select.Option value='1.1'>8</Select.Option>
          <Select.Option value='1.2'>12</Select.Option>
          <Select.Option value='1.3'>16</Select.Option>
          <Select.Option value='1.4'>20</Select.Option>
        </Select>
      </Field>

      <div className={classes.group}>
        <Heading data-size='2xs'>Light mode</Heading>

        <Field data-size='sm'>
          <Label>Fargemetning for Background og Surface</Label>
          <Select
            defaultValue='1'
            width='full'
            onChange={(e) => {
              onLightStaticSaturation(parseFloat(e.target.value));
            }}
          >
            <Select.Option value='0.6'>-40%</Select.Option>
            <Select.Option value='0.7'>-30%</Select.Option>
            <Select.Option value='0.8'>-20%</Select.Option>
            <Select.Option value='0.9'>-10%</Select.Option>
            <Select.Option value='1'>0%</Select.Option>
            <Select.Option value='1.1'>+10%</Select.Option>
            <Select.Option value='1.2'>+20%</Select.Option>
            <Select.Option value='1.3'>+30%</Select.Option>
            <Select.Option value='1.4'>+40%</Select.Option>
          </Select>
        </Field>

        <Field data-size='sm'>
          <Label>Fargemetning for Border og Text</Label>
          <Select
            defaultValue='1'
            width='full'
            onChange={(e) => {
              onLightStaticSaturation(parseFloat(e.target.value));
            }}
          >
            <Select.Option value='0.6'>-40%</Select.Option>
            <Select.Option value='0.7'>-30%</Select.Option>
            <Select.Option value='0.8'>-20%</Select.Option>
            <Select.Option value='0.9'>-10%</Select.Option>
            <Select.Option value='1'>0%</Select.Option>
            <Select.Option value='1.1'>+10%</Select.Option>
            <Select.Option value='1.2'>+20%</Select.Option>
            <Select.Option value='1.3'>+30%</Select.Option>
            <Select.Option value='1.4'>+40%</Select.Option>
          </Select>
        </Field>
      </div>

      <div className={classes.group}>
        <Heading data-size='2xs'>Dark mode</Heading>

        <Field data-size='sm'>
          <Label>Fargemetning for Background og Surface</Label>
          <Select defaultValue='1' width='full'>
            <Select.Option value='0.6'>-40%</Select.Option>
            <Select.Option value='0.7'>-30%</Select.Option>
            <Select.Option value='0.8'>-20%</Select.Option>
            <Select.Option value='0.9'>-10%</Select.Option>
            <Select.Option value='1'>0%</Select.Option>
            <Select.Option value='1.1'>+10%</Select.Option>
            <Select.Option value='1.2'>+20%</Select.Option>
            <Select.Option value='1.3'>+30%</Select.Option>
            <Select.Option value='1.4'>+40%</Select.Option>
          </Select>
        </Field>

        <Field data-size='sm'>
          <Label>Fargemetning for Border og Text</Label>
          <Select defaultValue='1' width='full'>
            <Select.Option value='0.6'>-40%</Select.Option>
            <Select.Option value='0.7'>-30%</Select.Option>
            <Select.Option value='0.8'>-20%</Select.Option>
            <Select.Option value='0.9'>-10%</Select.Option>
            <Select.Option value='1'>0%</Select.Option>
            <Select.Option value='1.1'>+10%</Select.Option>
            <Select.Option value='1.2'>+20%</Select.Option>
            <Select.Option value='1.3'>+30%</Select.Option>
            <Select.Option value='1.4'>+40%</Select.Option>
          </Select>
        </Field>
      </div>
    </div>
  );
};
