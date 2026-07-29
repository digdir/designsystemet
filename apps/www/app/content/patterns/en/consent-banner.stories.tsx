import {
  Button,
  Checkbox,
  Fieldset,
  Heading,
  Link,
  Paragraph,
  SkipLink,
} from '@digdir/designsystemet-react';

export const ConsentBanner = () => {
  return (
    <>
      <section aria-labelledby='consent-banner-title'>
        <Heading
          id='consent-banner-title'
          data-size='md'
          style={{ marginBottom: 'var(--ds-size-2)' }}
        >
          Do you allow us to collect information?
        </Heading>
        <Paragraph>
          If you consent, we will store and anlyse information that helps us improve the website. You can withdraw your consent at any time at the bottom of the page.{' '}
          <Link href='#more-about-what-we-collect' style={{ color: 'inherit' }}>
            More about what we store and why
          </Link>
        </Paragraph>
        <form
          method='post'
          action='/api/consent'
          style={{
            display: 'flex',
            gap: 'var(--ds-size-4)',
            marginTop: 'var(--ds-size-5)',
          }}
        >
          <Button name='action' type='submit'>
            Yes
          </Button>
          <Button name='action' type='submit'>
            No
          </Button>
        </form>
        <Paragraph
          data-size='sm'
          style={{
            marginTop: 'var(--ds-size-8)',
          }}
        >
          <Link href='#necessary-information' style={{ color: 'inherit' }}>
            We also store necessary information
          </Link>{' '}
          that cannot be opted out. This makes the website functional and secure.
        </Paragraph>
      </section>
      <SkipLink href='#main'>Skip to main content</SkipLink>
    </>
  );
};

export const ConsentBannerCheckboxes = () => {
  return (
    <>
      <section aria-labelledby='consent-banner-multiple-choice-title'>
        <form method='post' action='/api/consent'>
          <Fieldset>
            <Fieldset.Legend>
              <Heading
                id='consent-banner-multiple-choice-title'
                data-size='md'
                style={{ marginBottom: 'var(--ds-size-2)' }}
              >
                What information will you allow us to collect?
              </Heading>
            </Fieldset.Legend>
            <Fieldset.Description>
              The infomation helps us improve the website and solve issues quicker.
            </Fieldset.Description>
            <Checkbox
              label='How the website is used'
              name='consent'
              value='usage'
            />
            <Checkbox
              label='Technical errors that may occour'
              name='consent'
              value='technical-errors'
            />
          </Fieldset>
          <Paragraph
            style={{
              marginTop: 'var(--ds-size-5)',
            }}
          >
            You can change your choices at any time at the bottom of the page.{' '}
            <Link href='#more-about-what-we-collect' style={{ color: 'inherit' }}>
              More about what we store and why
            </Link>
          </Paragraph>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--ds-size-4)',
              marginTop: 'var(--ds-size-5)',
            }}
          >
            <Button name='action' type='submit' value='save'>
              Save choices
            </Button>
            <Button name='action' type='submit' value='approve-all'>
              Accept all
            </Button>
            <Button name='action' type='submit' value='decline-all'>
              Reject all
            </Button>
          </div>
        </form>
        <Paragraph
          data-size='sm'
          style={{
            marginTop: 'var(--ds-size-8)',
          }}
        >
          <Link href='#necessary-information' style={{ color: 'inherit' }}>
            We also store necessary information
          </Link>{' '}
          that cannot be opted out from. This makes the website functional and secure.
        </Paragraph>
      </section>
      <SkipLink href='#main'>Skip to main content</SkipLink>
    </>
  );
};
