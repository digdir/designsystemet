export const LineHeight = ({ value }: { value: string }) => {
  return (
    <div style={{ lineHeight: value }} lang='en'>
      line <br /> height
    </div>
  );
};

export const FontSize = ({ value }: { value: string }) => {
  return <div style={{ fontSize: value }}>Aa</div>;
};

export const FontWeight = ({ value }: { value: string; text: string }) => {
  return (
    <div style={{ fontWeight: value }} lang='en'>
      weight
    </div>
  );
};
export const FontFamily = ({ value }: { value: string }) => {
  return <div style={{ fontFamily: value }}>{value}</div>;
};

export const LetterSpacing = ({ value }: { value: string }) => {
  return (
    <div style={{ letterSpacing: value }} lang='en'>
      letter spacing
    </div>
  );
};
