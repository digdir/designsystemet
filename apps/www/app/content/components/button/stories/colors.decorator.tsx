const Code = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
        gap: 'var(--ds-size-2)',
      }}
    >
      {children}
    </div>
  );
};

export default Code;
