<script>
  import Alert from '$lib/components/Alert/Alert.svelte';
  import Button from '$lib/components/Button/Button.svelte';
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
</script>

<h1>Test components here!</h1>

<Button>Hello</Button>

<Link href="/route">Link</Link>
<Paragraph
  color="primary"
  spacing
  short>Lorem ipsum dorem</Paragraph
>
<List>
  <li><Alert severity="info">Alert (info, default)</Alert></li>
  <li><Alert severity="warning">Alert (warning)</Alert></li>
  <li><Alert severity="success">Alert (success)</Alert></li>
  <li><Alert severity="danger">Alert (danger)</Alert></li>
</List>

<Tag color="primary">Tag Primary</Tag>
<Tag color="secondary">Tag Secondary</Tag>
<Tag color="tertiary">Tag tertiary</Tag>
<Tag color="neutral">Tag neutral</Tag>
<Tag color="success">Tag success</Tag>
<Tag color="warning">Tag warning</Tag>
<Tag color="danger">Tag danger</Tag>
<Tag color="info">Tag info</Tag>

<Tag
  color="primary"
  variant="outlined">Tag Outlined</Tag
>

<Tag size="xsmall">Tag XS</Tag>
<Tag size="small">Tag small</Tag>
<Tag size="medium">Tag medium</Tag>

<Button on:click={openModal}>Open Modal</Button>
<Modal
  show={showModal}
  onClose={closeModal}
/>
