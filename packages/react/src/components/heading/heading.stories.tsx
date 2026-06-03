import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Heading } from './heading';

const meta: Meta<typeof Heading> = {
  title: 'Komponenter/Typography/Heading',
  component: Heading,
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const Preview: Story = {
  args: {
    children: 'Tittel tekst',
  },
};

function getComparableComputedStyle(element: HTMLElement) {
  const computed = getComputedStyle(element);
  return Object.fromEntries(
    Array.from(computed)
      .filter((prop) => !prop.startsWith('--'))
      .map((prop) => [prop, computed.getPropertyValue(prop)]),
  );
}

async function expectEqualBottomMargins(container: HTMLElement) {
  const headings = within(container).getAllByRole('heading');
  const margins = headings.map((h) => getComputedStyle(h).marginBottom);

  for (const margin of margins) {
    await expect(margin).toBe(margins[0]);
  }
}

async function expectEqualHeightAndWidth(container: HTMLElement) {
  const children = Array.from(container.children) as HTMLElement[];
  const dimensions = children.map((x) => ({
    height: x.scrollHeight,
    width: x.scrollWidth,
  }));

  for (const widthAndHeight of dimensions) {
    await expect(widthAndHeight).toEqual(dimensions[0]);
  }
}

const Headings = () => (
  <>
    <Heading data-size='2xl' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a 2xl heading
    </Heading>
    <Heading data-size='xl' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is an xl heading
    </Heading>
    <Heading data-size='lg' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a lg heading
    </Heading>
    <Heading data-size='md' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a md heading
    </Heading>
    <Heading data-size='sm' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a sm heading
    </Heading>
    <Heading data-size='xs' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is an xs heading
    </Heading>
    <Heading data-size='2xs' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a 2xs heading
    </Heading>
  </>
);

export const HeadingsInVariousSizes: StoryFn = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--ds-size-6)',
      whiteSpace: 'nowrap',
    }}
  >
    <div data-size='sm' data-testid='small'>
      <div>Size mode small</div>
      <Headings />
    </div>
    <div style={{ display: 'flex', gap: 'var(--ds-size-3)' }}>
      <div data-testid='implicit-medium'>
        Implicit size mode medium
        <Headings />
      </div>
      <div data-size='md' data-testid='medium'>
        Explicit size mode medium
        <Headings />
      </div>
    </div>
    <div data-size='lg' data-testid='large'>
      Size mode large
      <Headings />
    </div>
  </div>
);
HeadingsInVariousSizes.play = async ({ canvasElement, step }) => {
  const canvas = within(canvasElement);
  const small = canvas.getByTestId('small');
  const implicitMedium = canvas.getByTestId('implicit-medium');
  const explicitMedium = canvas.getByTestId('medium');
  const large = canvas.getByTestId('large');

  await step('size mode small: expect bottom margins to be equal', () =>
    expectEqualBottomMargins(small),
  );
  await step(
    'implicit size mode medium: expect bottom margins to be equal',
    () => expectEqualBottomMargins(implicitMedium),
  );
  await step(
    'explicit size mode medium: expect bottom margins to be equal',
    () => expectEqualBottomMargins(explicitMedium),
  );
  await step('size mode large: expect bottom margins to be equal', () =>
    expectEqualBottomMargins(large),
  );

  await step('medium should be bigger than small', () => {
    expect(explicitMedium.scrollHeight).toBeGreaterThan(small.scrollHeight);
  });

  await step('large should be bigger than medium', () => {
    expect(large.scrollHeight).toBeGreaterThan(explicitMedium.scrollHeight);
  });

  await step(
    'size mode medium: headings should be identical whether medium is impicit or explicit',
    async () => {
      const implicitHeadings = within(implicitMedium).getAllByRole('heading');
      const explicitHeadings = within(explicitMedium).getAllByRole('heading');
      for (let i = 0; i < implicitHeadings.length; i++) {
        const implicit = implicitHeadings[i];
        const explicit = explicitHeadings[i];
        await expect(getComparableComputedStyle(implicit)).toEqual(
          getComparableComputedStyle(explicit),
        );
      }
    },
  );
};

export const NestedSizeModes: StoryFn = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--ds-size-6)',
      whiteSpace: 'nowrap',
    }}
  >
    {/* Small */}
    <div
      style={{ display: 'flex', gap: 'var(--ds-size-3)' }}
      data-testid='small'
    >
      <div data-size='sm' data-testid='sm'>
        Small
        <Headings />
      </div>
      <div data-size='md'>
        <div data-size='sm' data-testid='md-sm'>
          Medium › Small
          <Headings />
        </div>
      </div>
      <div data-size='lg'>
        <div data-size='sm' data-testid='lg-sm'>
          Large › Small
          <Headings />
        </div>
      </div>
      <div data-size='lg'>
        <div data-size='md'>
          <div data-size='sm' data-testid='lg-md-sm'>
            Large › Medium › Small
            <Headings />
          </div>
        </div>
      </div>
      <div data-size='md'>
        <div data-size='lg'>
          <div data-size='sm' data-testid='md-lg-sm'>
            Medium › Large › Small
            <Headings />
          </div>
        </div>
      </div>
    </div>
    {/* Medium */}
    <div
      style={{ display: 'flex', gap: 'var(--ds-size-3)' }}
      data-testid='medium'
    >
      <div data-size='md' data-testid='md'>
        Medium
        <Headings />
      </div>
      <div data-size='sm'>
        <div data-size='md' data-testid='sm-md'>
          Small › Medium
          <Headings />
        </div>
      </div>
      <div data-size='lg'>
        <div data-size='md' data-testid='lg-md'>
          Large › Medium
          <Headings />
        </div>
      </div>
      <div data-size='lg'>
        <div data-size='sm'>
          <div data-size='md' data-testid='lg-sm-md'>
            Large › Small › Medium
            <Headings />
          </div>
        </div>
      </div>
      <div data-size='sm'>
        <div data-size='lg'>
          <div data-size='md' data-testid='sm-lg-md'>
            Small › Large › Medium
            <Headings />
          </div>
        </div>
      </div>
    </div>
    {/* Large */}
    <div
      style={{ display: 'flex', gap: 'var(--ds-size-3)' }}
      data-testid='large'
    >
      <div data-size='lg' data-testid='lg'>
        Large
        <Headings />
      </div>
      <div data-size='sm'>
        <div data-size='lg' data-testid='sm-lg'>
          Small › Large
          <Headings />
        </div>
      </div>
      <div data-size='md'>
        <div data-size='lg' data-testid='md-lg'>
          Medium › Large
          <Headings />
        </div>
      </div>
      <div data-size='sm'>
        <div data-size='md'>
          <div data-size='lg' data-testid='sm-md-lg'>
            Small › Medium › Large
            <Headings />
          </div>
        </div>
      </div>
      <div data-size='md'>
        <div data-size='sm'>
          <div data-size='lg' data-testid='md-sm-lg'>
            Small › Large › Medium
            <Headings />
          </div>
        </div>
      </div>
    </div>
  </div>
);
NestedSizeModes.play = async ({ canvasElement, step }) => {
  const canvas = within(canvasElement);
  const small = canvas.getByTestId('small');
  const medium = canvas.getByTestId('medium');
  const large = canvas.getByTestId('large');

  await step(
    'size mode small: expect equal dimensions for different nested modes',
    () => expectEqualHeightAndWidth(small),
  );
  await step(
    'size mode medium: expect equal dimensions for different nested modes',
    () => expectEqualHeightAndWidth(medium),
  );
  await step(
    'size mode large: expect equal dimensions for different nested modes',
    () => expectEqualHeightAndWidth(large),
  );
};
