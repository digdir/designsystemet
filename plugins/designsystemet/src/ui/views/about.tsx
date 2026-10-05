import { Heading, Link, List, Paragraph } from '@digdir/designsystemet-react';
import { postToPlugin } from '../post-to-plugin';

const SLACK_URL = 'https://www.designsystemet.no/slack';

// Explains what a sync does to the file. Opened from the paste view.
export function AboutView(): React.JSX.Element {
  return (
    <div className='about-view'>
      <Heading level={2} data-size='sm'>
        What does syncing do?
      </Heading>
      <Paragraph>Syncing makes this file match the config:</Paragraph>
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

      <div>
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
    </div>
  );
}
