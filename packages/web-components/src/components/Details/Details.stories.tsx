import type { Meta, StoryObj} from '@storybook/web-components';

import { Details } from './Details';
import './Details';

// import { Button, Card, Details, Link } from '../';

const meta: Meta<typeof Details> = {
  title: 'Komponenter/Details',
  component: 'ds-details',
  parameters: {
    layout: 'padded',
  },
  // Decides the order of properties
  args: {
    'data-color': 'neutral',
    open: undefined,
    defaultOpen: false,
  },
  argTypes: {
    open: {
      control: {
        type: 'boolean',
      },
      table: {
        type: {
          summary: `boolean`
        }
      },
      description: `Controls open-state.\n Using this removes automatic control of open-state`,
    },
    defaultOpen: {
      table: {
        defaultValue: {
          summary: 'false',
        }
      },
      description: `Defaults the details to open if not controlled`,
    }
  }
};

export default meta;

export const Preview: StoryObj = {
  args: {
    "data-color": 'neutral',
    "defaultOpen": false,
  },
  // Would like to avoid any, but cant get "data-{X}" attributes to be allowed
  render: (args: any) => {
    const dsDetails = document.createElement('ds-details');


    args && Object.keys(args).forEach((key) => {
      if (args[key] !== undefined) {
        dsDetails.setAttribute(key, args[key]);
      }
    });

    // Summary
    const summaryText = document.createTextNode('Hvem kan registrere seg i Frivillighetsregisteret?');
    const summary = document.createElement('ds-details-summary');
    summary.appendChild(summaryText);

    // Content
    const contentText = document.createTextNode(`For å kunne bli registrert i Frivillighetsregisteret, må organisasjonen
      drive frivillig virksomhet. Det er bare foreninger, stiftelser og
      aksjeselskap som kan registreres. Virksomheten kan ikke dele ut midler til
      fysiske personer. Virksomheten må ha et styre.`);
    const content = document.createElement('ds-details-content');
    content.appendChild(contentText);

    dsDetails.appendChild(summary);
    dsDetails.appendChild(content);
    return dsDetails;
  }
}

export const InCard: StoryObj = {
  args: {
    'data-color': 'neutral',
  },
  render: (args: any) => {
    const {
      "data-color": dataColor
     } = args;

    const dsCard = document.createElement('ds-card');
    const dsDetails = document.createElement('ds-details');

    dsCard.setAttribute('data-color', dataColor);
    // onToggle && dsDetails.setAttribute('onToggle', onToggle.toString());

    // Summary
    const summary = document.createElement('ds-details-summary');
    summary.appendChild(document.createTextNode('Vedlegg'));

    // Content
    const content = document.createElement('ds-details-content');
    content.appendChild(document.createTextNode('Vedlegg 1, vedlegg 2, vedlegg 3'));

    dsDetails.appendChild(summary);
    dsDetails.appendChild(content);
    dsCard.appendChild(dsDetails);
    return dsCard;
  }
}

export const InCardWithColor: StoryObj = {
  args: {
    'data-color': 'brand2',
  },
  render: (args: any) => {
    const {
      "data-color": dataColor
    } = args;

    const dsCard = document.createElement('ds-card');
    dsCard.setAttribute('data-color', dataColor);

    // onToggle && dsDetails.setAttribute('onToggle', onToggle.toString());

    // Initial details
    const dsDetailsInitial = document.createElement('ds-details');

    const summaryInitial = document.createElement('ds-details-summary');
    summaryInitial.appendChild(document.createTextNode('Hvordan får jeg tildelt jegernummer?'));

    const contentInitial = document.createElement('ds-details-content');
    contentInitial.appendChild(document.createTextNode(
      `Du vil automatisk få tildelt jegernummer og bli registrert i
      Jegerregisteret når du har bestått jegerprøven.`
    ));

    dsDetailsInitial.appendChild(summaryInitial);
    dsDetailsInitial.appendChild(contentInitial);

    dsCard.appendChild(dsDetailsInitial);

    // Second details
    const dsDetailsSecond = document.createElement('ds-details');

    const summarySecond = document.createElement('ds-details-summary');
    summarySecond.appendChild(document.createTextNode('Jeg har glemt jegernummeret mitt. Hvor finner jeg dette?'));

    const contentSecond = document.createElement('ds-details-content');
    const topP = document.createElement('p');
    topP.style.marginTop = "0";
    topP.appendChild(document.createTextNode(`Du kan finne dette ved å logge inn på `));
    const link = document.createElement('Link');
    link.setAttribute('href', 'https://minjegerside.brreg.no/');
    link.appendChild(document.createTextNode('Min side'));
    topP.appendChild(link);

    const nextP = document.createElement('p');
    nextP.appendChild(document.createTextNode(
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu
      orci nisi. Nulla sed sem eget odio pellentesque venenatis vitae et
      sem. Nunc vulputate nibh id nunc condimentum, et mattis quam vehicula.
      Praesent gravida turpis eget tincidunt sodales. Praesent ante arcu,
      semper at rhoncus ut, commodo ut ligula. Phasellus quis nibh vitae
      dolor faucibus dictum et dapibus justo. Morbi scelerisque sem id nisi
      ornare, in facilisis felis molestie.`));

    contentSecond.appendChild(topP);

    dsDetailsSecond.appendChild(summarySecond);
    dsDetailsSecond.appendChild(contentSecond);
    dsCard.appendChild(dsDetailsSecond);

    return dsCard;
  }
}

// TODO Controlled
// export const Controlled: StoryFn<typeof Details> = () => {
//   const [open1, setOpen1] = useState(false);
//   const [open2, setOpen2] = useState(false);
//   const [open3, setOpen3] = useState(false);
//   const toggleOpen = () => {
//     const isOpen = [open1, open2, open3].every(Boolean);
//     setOpen1(!isOpen);
//     setOpen2(!isOpen);
//     setOpen3(!isOpen);
//   };

//   return (
//     <>
//       <Button onClick={toggleOpen}>Toggle Details</Button>
//       <br />
//       <>
//         <Details open={open1} onToggle={() => setOpen1(!open1)}>
//           <Details.Summary>Enkeltpersonforetak</Details.Summary>
//           <Details.Content>
//             Skal du starte for deg selv? Enkeltpersonforetak er ofte den
//             enkleste måten å etablere bedrift på. Denne organisasjonsformen har
//             både fordeler og ulemper. Det gir deg stor grad av frihet, men kan
//             også gi betydelig risiko fordi du har personlig ansvar for
//             økonomien.
//           </Details.Content>
//         </Details>
//         <Details open={open2} onToggle={() => setOpen2(!open2)}>
//           <Details.Summary>Aksjeselskap (AS)</Details.Summary>
//           <Details.Content>
//             Planlegger du å starte næringsvirksomhet alene eller sammen med
//             andre? Innebærer næringsvirksomheten en økonomisk risiko? Vil du ha
//             rettigheter som arbeidstaker og muligheten til at andre kan
//             investere i selskapet ditt? Da kan aksjeselskap være en
//             hensiktsmessig organisasjonsform.
//           </Details.Content>
//         </Details>
//         <Details open={open3} onToggle={() => setOpen3(!open3)}>
//           <Details.Summary>Ansvarlig selskap (ANS/DA)</Details.Summary>
//           <Details.Content>
//             Er dere minst to personer som skal starte opp egen virksomhet?
//             Samarbeider du godt med den/de som du skal starte opp sammen med?
//             Krever virksomheten få investeringer og tar du liten økonomisk
//             risiko? Da kan du vurdere å etablere et ansvarlig selskap.
//           </Details.Content>
//         </Details>
//       </>
//     </>
//   );
// };
