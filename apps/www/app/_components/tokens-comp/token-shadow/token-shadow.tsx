import classes from './token-shadow.module.css';

interface TokenColorProps {
  value: string;
}

const TokenShadow = ({ value }: TokenColorProps) => {
  return (
    <div className={classes.shadow}>
      <div style={{ boxShadow: value }} className={classes.color}></div>
    </div>
  );
};

export { TokenShadow };
