import { Heading, List } from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <List.Unordered>
      <List.Item>Bøyabreen</List.Item>
      <List.Item>Briksdalsbreen</List.Item>
      <List.Item>Nigardsbreen</List.Item>
    </List.Unordered>
  );
};

export const Ordered = () => {
  return (
    <>
      <Heading
        level={2}
        data-size='xs'
        style={{ marginBottom: 'var(--ds-size-2)' }}
      >
        Slik gjør du:
      </Heading>
      <List.Ordered>
        <List.Item>
          Tørk over kyllingfiletene før du krydrer og steker
        </List.Item>
        <List.Item>Ha salt og pepper på filetene</List.Item>
        <List.Item>
          Stek filetene på sterk varme i to minutter på hver side
        </List.Item>
      </List.Ordered>
    </>
  );
};

export const Unordered = () => {
  return (
    <>
      <Heading
        level={2}
        data-size='xs'
        style={{ marginBottom: 'var(--ds-size-2)' }}
      >
        Foreningen har plikt til å ha revisor hvis de har
      </Heading>
      <List.Unordered>
        <List.Item>
          et gjennomsnittlig antall ansatte som tilsvarer ti årsverk eller mer
        </List.Item>
        <List.Item>balansesum som er 27 millioner kroner eller mer</List.Item>
        <List.Item>driftsinntekter på 35 millioner kroner eller mer</List.Item>
      </List.Unordered>
    </>
  );
};
