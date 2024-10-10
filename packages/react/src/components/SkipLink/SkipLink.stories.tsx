import type { Meta, StoryFn } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { Paragraph } from '../';

import { SkipLink } from '.';
type Story = StoryFn<typeof SkipLink>;

export default {
  title: 'Komponenter/SkipLink',
  component: SkipLink,
} satisfies Meta;

export const Preview: Story = () => (
  <>
    <Paragraph>
      For å vise skiplinken, tab til dette eksempelet, eller klikk inni
      eksempelet og trykk <kbd>Tab</kbd>.
      <SkipLink href='#main-content'>Hopp til hovedinnhold</SkipLink>
    </Paragraph>
    <main id='main-content' tabIndex={-1}>
      Region som kan motta fokus fra skiplink.
    </main>
  </>
);

export const Tabbed: Story = () => (
  <Paragraph>
    For å vise skiplinken, tab til dette eksempelet, eller klikk inni eksempelet
    og trykk <kbd>Tab</kbd>.
    <SkipLink href='#main-content'>Hopp til hovedinnhold</SkipLink>
    <main id='main-content' tabIndex={-1}>
      Region som kan motta fokus fra skiplink.
    </main>
  </Paragraph>
);
Tabbed.play = async (ctx) => {
  const canvas = within(ctx.canvasElement);
  const link = canvas.getByRole('link');
  await expect(link).not.toSatisfy(isVisibleOnScreen);
  await userEvent.tab();
  await expect(link).toSatisfy(isVisibleOnScreen);
  await expect(link).toHaveFocus();
};

function isVisibleOnScreen(el: Element) {
  const { height, width } = el.getBoundingClientRect();
  return height > 1 && width > 1;
}
