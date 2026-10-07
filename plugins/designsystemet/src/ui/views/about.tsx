import { Heading, Link, List, Paragraph } from '@digdir/designsystemet-react';
import { postToPlugin } from '../post-to-plugin';

const SLACK_URL = 'https://www.designsystemet.no/slack';
const FIGMA_PRICING_URL = 'https://www.figma.com/pricing/';

// Explains what an import does to the file. Opened from the paste view.
export function AboutView(): React.JSX.Element {
  return (
    <div className='about-view'>
      <Heading level={2} data-size='sm'>
        What does importing do?
      </Heading>
      <Paragraph>Importing makes this file match the config:</Paragraph>
      <List.Unordered>
        <List.Item>
          Creates the variable collections, modes, variables, text styles and
          effect styles in the config.
        </List.Item>
        <List.Item>
          Updates the ones that already exist, matched by name, so layers using
          them stay connected.
        </List.Item>
        <List.Item>
          Deletes modes and variables in those collections that aren't in the
          config, including ones added by hand. The same goes for text styles
          under typography/ and effect styles under shadow/.
        </List.Item>
        <List.Item>Leaves other collections and styles alone.</List.Item>
      </List.Unordered>
      <Paragraph>
        Each theme, color scheme and size becomes a mode in a variable
        collection. Figma limits how many modes a collection can have depending
        on your plan, so make sure yours allows enough modes for your config.
        See{' '}
        <Link
          href={FIGMA_PRICING_URL}
          onClick={(event) => {
            event.preventDefault();
            postToPlugin('open-external', { url: FIGMA_PRICING_URL });
          }}
        >
          Figma's plans
        </Link>
        .
      </Paragraph>
      <Paragraph>
        Need help or have questions? Join our{' '}
        <Link
          href={SLACK_URL}
          onClick={(event) => {
            event.preventDefault();
            postToPlugin('open-external', { url: SLACK_URL });
          }}
        >
          Slack
        </Link>{' '}
        community.
      </Paragraph>
    </div>
  );
}
