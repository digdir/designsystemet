import { Heading, List, Paragraph } from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <List.Unordered>
      <List.Item>Bøyabreen</List.Item>
      <List.Item>Briksdalsbreen</List.Item>
      <List.Item>Nigardsbreen</List.Item>
    </List.Unordered>
  );
};

export const OrderedEN = () => {
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

export const UnorderedEN = () => {
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

export const Write1 = () => {
  return (
    <>
      <Heading
        level={2}
        data-size='xs'
        style={{ marginBottom: 'var(--ds-size-2)' }}
      >
        Siste frist for å søke er
      </Heading>
      <List.Unordered>
        <List.Item>
          15.november for hele året eller bare høstsemesteret
        </List.Item>
        <List.Item>15.mars for vårsemesteret</List.Item>
      </List.Unordered>
    </>
  );
};

export const Write2 = () => {
  return (
    <>
      <Heading
        level={2}
        data-size='xs'
        style={{ marginBottom: 'var(--ds-size-2)' }}
      >
        Du må som hovedregel fylle disse vilkårene:
      </Heading>
      <List.Unordered>
        <List.Item>Du må være mellom 18 og 67 år.</List.Item>
        <List.Item>
          Du må ha vært medlem av folketrygden de siste 5 årene før du ble syk
          eller skadet.
        </List.Item>
        <List.Item>
          Du må ha minst 50 prosent redusert arbeids- og inntektsevne.
        </List.Item>
      </List.Unordered>
    </>
  );
};

export const Write1EN = () => {
  return (
    <>
      <Heading
        level={2}
        data-size='xs'
        style={{ marginBottom: 'var(--ds-size-2)' }}
      >
        The application deadline is
      </Heading>
      <List.Unordered>
        <List.Item>
          15 November for the full year or autumn semester only
        </List.Item>
        <List.Item>15 March for the spring semester</List.Item>
      </List.Unordered>
    </>
  );
};

export const Write2EN = () => {
  return (
    <>
      <Heading
        level={2}
        data-size='xs'
        style={{ marginBottom: 'var(--ds-size-2)' }}
      >
        As a general rule, you must meet these requirements:
      </Heading>
      <List.Unordered>
        <List.Item>You must be between 18 and 67 years old.</List.Item>
        <List.Item>
          You must have been a member of the National Insurance Scheme for the
          last 5 years before you became ill or injured.
        </List.Item>
        <List.Item>
          You must have at least a 50 per cent reduction in your ability to work
          and earn an income.
        </List.Item>
      </List.Unordered>
    </>
  );
};
