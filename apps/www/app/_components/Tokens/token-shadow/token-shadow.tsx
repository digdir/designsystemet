import classes from './token-shadow.module.css';

interface TokenColorProps {
  value: string;
}

const TokenShadow = ({ value }: TokenColorProps) => {
  return <div style={{ boxShadow: value }} className={classes.color}></div>;
};

export { TokenShadow };
