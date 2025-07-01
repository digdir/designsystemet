import classes from './token-font-size.module.css';

interface TokenFontSizeProps {
  value: string;
}

const TokenFontSize = ({ value }: TokenFontSizeProps) => {
  return (
    <div style={{ fontSize: value }} className={classes.font}>
      Aa
    </div>
  );
};

export { TokenFontSize };
