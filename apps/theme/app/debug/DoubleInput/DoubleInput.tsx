import {
  ArrowCirclepathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@navikt/aksel-icons';
import classes from './DoubleInput.module.css';

type DoubleInputProps = {
  label: string;
  valueOne: string;
  valueTwo: string;
  setValueOne: (value: string) => void;
  setValueTwo: (value: string) => void;
};

type InputProps = {
  value: string;
  setValue: (value: string) => void;
};

const Input = ({ value, setValue }: InputProps) => {
  return (
    <div className={classes.input}>
      <input
        type='text'
        defaultValue={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className={classes.btn}>
        <ArrowCirclepathIcon title='a11y-title' fontSize='1.1rem' />
      </button>
      <div className={classes.arrows}>
        <button className={classes.arrow}>
          <ChevronUpIcon title='a11y-title' />
        </button>
        <button className={classes.arrow}>
          <ChevronDownIcon title='a11y-title' />
        </button>
      </div>
    </div>
  );
};

export const DoubleInput = ({
  label,
  valueOne,
  valueTwo,
  setValueOne,
  setValueTwo,
}: DoubleInputProps) => {
  return (
    <div className={classes.container}>
      <div className={classes.text}>{label}</div>
      <div className={classes.inputs}>
        <Input value={valueOne} setValue={(e) => setValueOne(e)} />
        <Input value={valueTwo} setValue={(e) => setValueTwo(e)} />
      </div>
    </div>
  );
};
