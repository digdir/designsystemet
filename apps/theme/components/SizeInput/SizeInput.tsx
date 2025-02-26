import { PencilIcon } from '@navikt/aksel-icons';
import classes from './SizeInput.module.css';

type SizeInputProps = {
  onChange: (size: string) => void;
  name: string;
  size: string;
};

export const SizeInput = ({ onChange, size, name }: SizeInputProps) => {
  return (
    <div className={classes.component}>
      <div className={classes.label}>{name}</div>
      <button className={classes.box} onClick={() => onChange(size)}>
        {size}
        <PencilIcon aria-hidden fontSize='1.4rem' className={classes.icon} />
      </button>
    </div>
  );
};
