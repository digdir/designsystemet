import classes from './TokenFontSize.module.css';

interface TokenFontSizeProps {
  value: string;
}

const TokenFontSize = ({ value }: TokenFontSizeProps) => {
  return (
    <div
      style={{ font: value }}
      className={classes.font}
    >
      Aa
    </div>
  );
};

export { TokenFontSize };
