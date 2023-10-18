<script>
  import Alert from '$lib/components/Alert/Alert.svelte';
  import Button from '$lib/components/Button/Button.svelte';
  import Radio from '$lib/components/Form/Radio/Radio.svelte';
  import RadioGroup from '$lib/components/Form/Radio/RadioGroup.svelte';
  import Textfield from '$lib/components/Form/Textfield/Textfield.svelte';
  import Link from '$lib/components/Link/Link.svelte';
  import List from '$lib/components/List/List.svelte';
  import Tag from '$lib/components/Tag/Tag.svelte';
  import Paragraph from '$lib/components/Typography/Paragraph/Paragraph.svelte';
  import Modal from '$lib/components/Modal/Modal.svelte';

  let showModal = false;

  function openModal(event) {
    event.stopPropagation();
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  let textfieldValue = '';

  let selectedValue;
  function handleGroupChange(event) {
    selectedValue = event.detail;
  }
</script>

<h1>Test components here!</h1>

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

<Textfield bind:value={textfieldValue} />

<Link href="/route">Link</Link>
<Paragraph
  spacing
  short>Lorem ipsum dorem</Paragraph
>
<List>
  <li><Alert severity="info">Alert (info, default)</Alert></li>
  <li><Alert severity="warning">Alert (warning)</Alert></li>
  <li><Alert severity="success">Alert (success)</Alert></li>
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
<Button on:click={openModal}>Open Modal</Button>
<Tag size="xsmall">Tag XS</Tag>
<Tag size="small">Tag small</Tag>
<Tag size="medium">Tag medium</Tag>
<RadioGroup
  bind:value={selectedValue}
  on:change={handleGroupChange}
  inline={false}
  legend="RadioGroup legend"
  description="RadioGroup description"
  size="medium"
  defaultValue="option1"
  readOnly={false}
  disabled={false}
  error="Lorem ipsum error."
  hideLegend={false}
>
  <Radio
    value="option1"
    label="Lorem ipsum."
  />
  <Radio
    value="option2"
    label="Lorem ipsum 2."
    description="Lorem ipsum description."
  />
  <Radio
    readOnly={true}
    value="option3"
    label="Lorem ipsum dolor sit amet."
    description="Lorem ipsum dolor sit amet description."
  />
  <Radio
    disabled={true}
    value="option4"
    label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum description."
  />
</RadioGroup>
<p>Selected RadioGroup value: {selectedValue}</p>
<Modal
  show={showModal}
  onClose={closeModal}
/>
