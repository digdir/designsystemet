import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useState } from 'react';
import classes from './DoubleInput.module.css';

type DoubleInputProps = {
  label: string;
  valueOne: string;
  valueTwo?: string;
  setValueOne: (value: string) => void;
  setValueTwo?: (value: string) => void;
};

type InputProps = {
  value: string;
  setValue: (value: string) => void;
};

const Input = ({ value, setValue }: InputProps) => {
  const [oldValue, setOldValue] = useState<string>(value);
  const [newValue, setNewValue] = useState<string>(value);

  return (
    <div
      className={cl(
        classes.input,
        oldValue !== newValue && classes.activeInput,
      )}
    >
      <input
        type='text'
        defaultValue={value}
        value={newValue}
        onChange={(e) => {
          setValue(e.target.value);
          setNewValue(e.target.value);
        }}
      />
      <button
        className={classes.btn}
        onClick={() => {
          setNewValue(oldValue);
          setValue(oldValue);
        }}
      >
        <ArrowCirclepathIcon title='a11y-title' fontSize='1.1rem' />
      </button>
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
        {valueTwo && setValueTwo && (
          <Input value={valueTwo} setValue={(e) => setValueTwo(e)} />
        )}
      </div>
    </div>
  );
};
