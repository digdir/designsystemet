<script>
  import { writable } from 'svelte/store';
  import Alert from '$lib/components/Alert/Alert.svelte';
  import Button from '$lib/components/Button/Button.svelte';
  import Switch from '$lib/components/Form/Switch/Switch.svelte';
  import Radio from '$lib/components/Form/Radio/Radio.svelte';
  import RadioGroup from '$lib/components/Form/Radio/RadioGroup.svelte';
  import Textfield from '$lib/components/Form/Textfield/Textfield.svelte';
  import Link from '$lib/components/Link/Link.svelte';
  import List from '$lib/components/List/List.svelte';
  import Tag from '$lib/components/Tag/Tag.svelte';
  import Paragraph from '$lib/components/Typography/Paragraph/Paragraph.svelte';
  import Modal from '$lib/components/Modal/Modal.svelte';
  import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    Tooltip,
  } from '$lib';
  import Tabs from '$lib/components/Tabs/Tabs.svelte';

  import InformationSquareFillIcon from '@navikt/aksel-icons/svg/InformationSquareFill.svg?raw';
  import CheckmarkCircleFillIcon from '@navikt/aksel-icons/svg/CheckmarkCircleFill.svg?raw';
  import XMarkOctagonFillIcon from '@navikt/aksel-icons/svg/XMarkOctagonFill.svg?raw';
  import Spinner from '$lib/components/Spinner/Spinner.svelte';

  let isModalOpen = false;

  function openModal(event) {
    event.stopPropagation();
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  let textfieldValue = '';
  let isSwitchChecked = false;

  $: if (isSwitchChecked !== undefined) {
    console.log(isSwitchChecked);
  }

  function handleSwitchClickEvent(event) {
    console.log('switch clicked', event);
  }

  function handleSwitchChangeEvent(event) {
    console.log('switch change', event.detail);
  }

  let selectedValue;
  function handleGroupChange(event) {
    selectedValue = event.detail;
  }

  let showError = false;
  function toggleShowError() {
    showError = !showError;
  }

  let isInline = false;
  function toggleInline() {
    isInline = !isInline;
  }

  let isHideLegend = false;
  function toggleIsHideLegend() {
    isHideLegend = !isHideLegend;
  }

  let isDisabled = false;
  function toggleIsDisabled() {
    isDisabled = !isDisabled;
  }

  let isReadOnly = false;
  function toggleIsReadOnly() {
    isReadOnly = !isReadOnly;
  }
  const tabs = [
    {
      icon: InformationSquareFillIcon,
      title: 'Tabulator 1',
      content: 'Tab 1 content',
    },
    {
      icon: CheckmarkCircleFillIcon,
      title: 'Tab 2',
      content: 'Tab 2 content',
    },
    {
      icon: XMarkOctagonFillIcon,
      title: 'Tab 3',
      content: 'Tab 3 content',
    },
  ];
</script>

<h1>Test components here!</h1>

<Switch
  on:click={handleSwitchClickEvent}
  on:change={handleSwitchChangeEvent}
  bind:checked={isSwitchChecked}>Switch</Switch
>

<Switch
  checked={isSwitchChecked}
  disabled>Disabled Switch</Switch
>
<Switch
  checked={isSwitchChecked}
  readOnly>Readonly Switch</Switch
>
<Switch
  checked={isSwitchChecked}
  position="right">Switch Label right</Switch
>

<Switch
  checked={isSwitchChecked}
  description="Ipsum lorem dorem durem">Switch with Description</Switch
>

<Button>First</Button>
<Button color="second">Secondary</Button>
<Button color="success">Success</Button>
<Button variant="quiet">First (Quiet)</Button>
<Button variant="outline">First (Outline)</Button>
<Button iconPlacement="right"
  ><svelte:fragment slot="icon"
    ><svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm5.047 5.671 1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032Z"
        fill="currentColor"
      />
    </svg></svelte:fragment
  >First Icon</Button
>

<Textfield
  bind:value={textfieldValue}
  size="small"
  characterLimit={10}
  characterLimitLabel={(count) =>
    count > -1
      ? `Du har ${count} tegn igjen.`
      : `Du har ${Math.abs(count)} tegn for mye.`}
/>

<Link href="/route">Link</Link>
<Paragraph
  spacing
  short>Lorem ipsum dorem</Paragraph
>

<List as="ol">
  <li><Alert severity="info">Alert (info, default)</Alert></li>
  <li><Alert severity="warning">Alert (warning)</Alert></li>
  <li><Button>knapp</Button><Button>knapp</Button></li>
</List>

<List>
  <li><Alert severity="success">Alert (success)</Alert></li>
  <li><Alert severity="danger">Alert (danger)</Alert></li>
</List>

<List as="none">
  <li><Alert severity="info">Alert (info, default)</Alert></li>
  <li><Alert severity="danger">Alert (danger)</Alert></li>
</List>

<Tag color="first">Tag Primary</Tag>
<Tag color="second">Tag Secondary</Tag>
<Tag color="third">Tag tertiary</Tag>
<Tag color="neutral">Tag neutral</Tag>
<Tag color="success">Tag success</Tag>
<Tag color="warning">Tag warning</Tag>
<Tag color="danger">Tag danger</Tag>
<Tag color="info">Tag info</Tag>

<Tag
  color="first"
  variant="outlined">Tag Outlined</Tag
>

<Accordion
  border={true}
  color="second"
>
  <AccordionItem>
    <AccordionHeader level={1}>
      <svelte:fragment slot="header">
        Hvem kan registrere seg i Frivillighetsregisteret?
      </svelte:fragment>
    </AccordionHeader>
    <AccordionContent>
      <svelte:fragment slot="content">
        For å kunne bli registrert i Frivillighetsregisteret, må organisasjonen
        drive frivillig virksomhet. Det er bare foreninger, stiftelser og
        aksjeselskap som kan registreres. Virksomheten kan ikke dele ut midler
        til fysiske personer. Virksomheten må ha et styre.
      </svelte:fragment>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionHeader level={4}>
      <svelte:fragment slot="header">
        Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
      </svelte:fragment>
    </AccordionHeader>
    <AccordionContent>
      <svelte:fragment slot="content">
        Virksomheten må være registrert i Enhetsregisteret før den kan bli
        registrert i Frivillighetsregisteret. Du kan registrere i begge
        registrene samtidig i Samordnet registermelding.
      </svelte:fragment>
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Button on:click={openModal}>Open Modal</Button>

{#if isModalOpen}
  <Modal onClose={closeModal} />
{/if}

<Tag size="xsmall">Tag XS</Tag>
<Tag size="small">Tag small</Tag>
<Tag size="medium">Tag medium</Tag>

<RadioGroup
  bind:value={selectedValue}
  on:change={handleGroupChange}
  inline={isInline}
  legend="RadioGroup legend"
  description="RadioGroup description"
  size="medium"
  defaultValue="option1"
  readOnly={isReadOnly}
  disabled={isDisabled}
  error={showError ? 'Lorem ipsum error.' : ''}
  hideLegend={isHideLegend}
>
  <Radio
    value="option1"
    label="Lorem ipsum label."
  />
  <Radio
    value="option2"
    label="Lorem ipsum dolor sit label."
    description="Lorem ipsum dolor sit description."
  />
  <Radio
    readOnly={true}
    value="option3"
    label="Lorem ipsum dolor sit amet readonly label."
    description="Lorem ipsum dolor sit amet readonly description."
  />
  <Radio
    disabled={true}
    value="option4"
    label="Lorem ipsum dolor sit amet disabled label."
    description="Lorem ipsum dolor sit amet disabled description."
  />
</RadioGroup>
<Button on:click={toggleIsHideLegend}
  >{isHideLegend ? 'Show legend' : 'Hide legend'}</Button
>
<Button on:click={toggleInline}>{isInline ? 'Vertical' : 'Inline'}</Button>
<Button on:click={toggleShowError}
  >{showError ? 'Hide error' : 'Show error'}</Button
>
<Button on:click={toggleIsDisabled}>{isDisabled ? 'Enable' : 'Disable'}</Button>
<Button on:click={toggleIsReadOnly}
  >{isReadOnly ? 'Selectable' : 'ReadOnly'}</Button
>
<p>Selected RadioGroup value: {selectedValue}</p>

<Tabs {tabs} />

<Tooltip
  content="Tooltip text"
  placement="top"
>
  <Button>Tooltip</Button>
</Tooltip>

<p>
  Tooltips kan også legges <nobr
    ><Tooltip
      content="Ganske kult?"
      placement="bottom"
      ><abbr style="font-weight: bold; text-decoration: underline dotted;"
        >til i en tekst</abbr
      ></Tooltip
    ></nobr
  > for å gi mer informasjon!
</p>

<h1>Spinner</h1>
<div class="spinner">
  <Spinner
    size="xLarge"
    title="xLarge"
    variant="interaction"
  />
  <Spinner
    size="large"
    title="large"
    variant="interaction"
  />
  <Spinner
    size="medium"
    title="medium"
    variant="interaction"
  />
  <Spinner
    size="small"
    title="small"
    variant="interaction"
  />
  <Spinner
    size="xSmall"
    title="xSmall"
    variant="interaction"
  />
</div>
<div class="spinner">
  <Spinner
    size="xLarge"
    title="xLarge default"
  />
  <Spinner
    size="xLarge"
    title="xLarge interaction"
    variant="interaction"
  />
  <Spinner
    size="xLarge"
    title="xLarge inverted"
    variant="inverted"
  />
</div>
