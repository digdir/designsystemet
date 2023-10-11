<script>
  import Alert from '$lib/components/Alert/Alert.svelte';
  import Button from '$lib/components/Button/Button.svelte';
  import Textfield from '$lib/components/Form/Textfield/Textfield.svelte';
  import Link from '$lib/components/Link/Link.svelte';
  import List from '$lib/components/List/List.svelte';
  import Tag from '$lib/components/Tag/Tag.svelte';
  import Paragraph from '$lib/components/Typography/Paragraph/Paragraph.svelte';

  let textfieldValue = '';
</script>

<h1>Test components here!</h1>

<Button>First</Button>
<Button color="second">Secondary</Button>
<Button color="success">Success</Button>
<Button variant="quiet">First (Quiet)</Button>
<Button variant="outline">First (Outline)</Button>

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

<Tag size="xsmall">Tag XS</Tag>
<Tag size="small">Tag small</Tag>
<Tag size="medium">Tag medium</Tag>
