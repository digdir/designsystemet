const Code = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--ds-size-2)',
      }}
    >
      {children}
    </div>
  );
};

export default Code;
