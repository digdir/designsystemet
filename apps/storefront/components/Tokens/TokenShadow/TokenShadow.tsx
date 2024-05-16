import classes from './TokenShadow.module.css';

interface TokenColorProps {
  value: string;
}

const TokenShadow = ({ value }: TokenColorProps) => {
  return (
    <div
      style={{ boxShadow: value }}
      className={classes.color}
    ></div>
  );
};

export { TokenShadow };
