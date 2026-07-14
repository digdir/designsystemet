import { expect, userEvent, within } from 'storybook/test';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { Paragraph } from '../';
import { SkipLink } from './skip-link';

const meta = preview.meta({
  title: 'Komponenter/SkipLink',
  component: SkipLink,
  args: {
    children: 'Hopp til hovedinnhold',
    href: '#main-content',
  },
});

export const Preview = meta.story({
  render: (args) => (
    <>
      <Paragraph>
        For å vise skiplinken, tab til dette eksempelet, eller klikk inni
        eksempelet og trykk <kbd>Tab</kbd>.
        <SkipLink {...args} />
      </Paragraph>
      <main id='main-content' tabIndex={-1}>
        Region som kan motta fokus fra skiplink.
      </main>
    </>
  ),
});

export const Tabbed = meta.story({
  render: () => (
    <div>
      For å vise skiplinken, tab til dette eksempelet, eller klikk inni
      eksempelet og trykk <kbd>Tab</kbd>.
      <SkipLink href='#main-content'>Hopp til hovedinnhold</SkipLink>
      <main id='main-content' tabIndex={-1}>
        Region som kan motta fokus fra skiplink.
      </main>
    </div>
  ),

  play: async (ctx) => {
    const canvas = within(ctx.canvasElement);
    const link = canvas.getByRole('link');
    await expect(link).not.toSatisfy(isVisibleOnScreen);
    await userEvent.tab();
    await expect(link).toSatisfy(isVisibleOnScreen);
    await expect(link).toHaveFocus();
  },
});

function isVisibleOnScreen(el: Element) {
  const { height, width } = el.getBoundingClientRect();
  return height > 1 && width > 1;
}
