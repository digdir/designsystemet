import classes from './TokenSize.module.css';

interface TokenFontSizeProps {
  value: string;
}

const TokenSize = ({ value }: TokenFontSizeProps) => {
  return (
    <div style={{ font: value }} className={classes.size}>
      <div className={classes.bar} style={{ width: value }}></div>
    </div>
  );
};

export { TokenSize };
