import { FilesIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../';
import { Tooltip } from './tooltip';

type Story = StoryObj<typeof Tooltip>;

export default {
  title: 'Komponenter/Tooltip',
  component: Tooltip,
  parameters: {
    customStyles: { margin: '2rem', padding: '4rem' },
    chromatic: {
      disableSnapshot: false,
    },
  },
  play: async (ctx) => {
    // When not in Docs mode, automatically open the tooltip
    const canvas = within(ctx.canvasElement);
    const button = canvas.getByRole('button');
    /* wait 1s for tooltip to show */
    await userEvent.hover(button);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
    const tooltip = canvas.getByRole('tooltip');
    await expect(tooltip).toBeInTheDocument();
    await expect(tooltip).toBeVisible();
  },
} satisfies Meta;

export const Preview: StoryFn<typeof Tooltip> = (args) => (
  <Tooltip {...args}>
    <Button icon>
      <FilesIcon aria-hidden />
    </Button>
  </Tooltip>
);

Preview.args = {
  content: 'Kopier',
  placement: 'top',
};

export const WithString: Story = {
  args: {
    content: 'Organisasjonsnummer',
    children: 'Org.nr.',
  },
};

WithString.play = async (ctx) => {
  // When not in Docs mode, automatically open the tooltip
  const canvas = within(ctx.canvasElement);
  const button = canvas.getByText('Org.nr.');
  await userEvent.hover(button);
  /* wait 1s for tooltip to show */
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
  const tooltip = canvas.getByRole('tooltip');
  await expect(tooltip).toBeInTheDocument();
  await expect(tooltip).toBeVisible();
};

export const Placement: Story = {
  args: {
    content: 'Kopier',
    placement: 'bottom',
    children: (
      <Button icon>
        <FilesIcon aria-hidden />
      </Button>
    ),
  },
};
