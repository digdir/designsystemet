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

export const OrderedEn = () => {
  return (
    <>
      <Heading
        level={2}
        data-size='xs'
        style={{ marginBottom: 'var(--ds-size-2)' }}
      >
        How to do it:
      </Heading>

      <List.Ordered>
        <List.Item>
          Pat the chicken breasts dry before seasoning and frying
        </List.Item>
        <List.Item>Add salt and pepper to the breasts</List.Item>
        <List.Item>
          Fry the breasts on high heat for two minutes on each side
        </List.Item>
      </List.Ordered>
    </>
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

export const UnorderedEn = () => {
  return (
    <>
      <Heading
        level={2}
        data-size='xs'
        style={{ marginBottom: 'var(--ds-size-2)' }}
      >
        The association is required to have an auditor if it has
      </Heading>

      <List.Unordered>
        <List.Item>
          an average number of employees equivalent to ten full-time positions
          or more
        </List.Item>
        <List.Item>
          a balance sheet total of 27 million kroner or more
        </List.Item>
        <List.Item>operating income of 35 million kroner or more</List.Item>
      </List.Unordered>
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
