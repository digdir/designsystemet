<script>
  import Alert from '$lib/components/Alert/Alert.svelte';
  import Link from '$lib/components/Link/Link.svelte';
  import List from '$lib/components/List/List.svelte';
  import Tag from '$lib/components/Tag/Tag.svelte';
  import Paragraph from '$lib/components/Typography/Paragraph/Paragraph.svelte';
</script>

<h1>Test components here!</h1>

<Link href="/route">Link</Link>
<Paragraph>Lorem ipsum dorem</Paragraph>
<List>
  <li><Alert severity="info">Alert (info, default)</Alert></li>
  <li><Alert severity="warning">Alert (warning)</Alert></li>
  <li><Alert severity="success">Alert (success)</Alert></li>
  <li><Alert severity="danger">Alert (danger)</Alert></li>
</List>

<Tag>Tag</Tag>
<Tag color="primary">Tag</Tag>
