import classes from './token-border-radius.module.css';

const TokenBorderRadius = ({ value }: { value: string }) => {
  return <div className={classes.bar} style={{ borderRadius: value }}></div>;
};

export { TokenBorderRadius };
