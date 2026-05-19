import { FilesIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';
import { Button, Link } from '../../';
import { Tooltip } from './tooltip';

type Story = StoryObj<typeof Tooltip>;
type FnStory = StoryFn<typeof Tooltip>;

function isInViewport(el: Element) {
  const { height, width } = el.getBoundingClientRect();
  return height > 1 && width > 1;
}

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
    const tooltips = ctx.canvasElement.querySelectorAll('[data-tooltip]');
    for (const event of [fireEvent.focus, userEvent.hover])
      for (const tooltipTrigger of tooltips) {
        await event(tooltipTrigger);
        await waitFor(async () => {
          const text = tooltipTrigger.getAttribute('data-tooltip');
          if (!text) {
            throw new Error('Tooltip trigger has no data-tooltip attribute');
          }
          const tooltipRenderer = document.body.querySelector('.ds-tooltip');
          await expect(tooltipRenderer).toBeVisible();
          await expect(tooltipRenderer).toSatisfy(isInViewport); // toBeVisible() doesn't check if the element is in the viewport
          await expect(tooltipRenderer).toHaveTextContent(text);
          if (tooltipTrigger.textContent.trim()) {
            await expect(tooltipTrigger).toHaveAttribute(
              'aria-description',
              text,
            );
          } else {
            await expect(tooltipTrigger).toHaveAttribute('aria-label', text);
          }
        });
      }
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

export const WithLink: FnStory = () => {
  return (
    <Tooltip content='Gå til en annen side...' placement='top'>
      <Link href='#'>En lenke</Link>
    </Tooltip>
  );
};

export const WithSpan: FnStory = () => {
  return (
    <Tooltip content='Innholdet i tooltipen' placement='top'>
      <span>Tekst med tooltip</span>
    </Tooltip>
  );
};

export const WithPlainText: FnStory = () => {
  return (
    <Tooltip content='Innholdet i tooltipen' placement='top'>
      Tekst med tooltip
    </Tooltip>
  );
};

export const WithString: Story = {
  args: {
    content: 'Organisasjonsnummer',
    children: 'Org.nr.',
    tabIndex: 0,
  },
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

export const Aria: FnStory = () => {
  return (
    <>
      <Tooltip content='Beskrivelse for aria-description'>
        <Button>Eg er aria-description</Button>
      </Tooltip>
      <Tooltip content='Beskrivelse for aria-description'>
        <Button>
          <FilesIcon aria-hidden />
          <span>Eg er også aria-description</span>
        </Button>
      </Tooltip>
      <Tooltip content='Eg er aria-label'>
        <Button icon>
          <FilesIcon aria-hidden />
        </Button>
      </Tooltip>
    </>
  );
};

Aria.parameters = {
  customStyles: {
    display: 'flex',
    gap: 'var(--ds-size-2)',
    alignItems: 'center',
  },
};

export const WithDynamicTooltipText: Story = {
  args: {
    content: 'Kopier',
  },
  render: () => {
    const [content, setContent] = useState('Kopier');

    return (
      <Tooltip content={content}>
        <Button
          icon
          onClick={() => setContent('Kopiert')}
          onBlur={() => setContent('Kopier')}
        >
          <FilesIcon aria-hidden />
        </Button>
      </Tooltip>
    );
  },
};

export const WithCSSTooltipText: Story = {
  args: {
    content: 'Kopier',
  },
  render: () => (
    <Tooltip content=''>
      <Button style={{ '--ds-tooltip': '"Kopier"' } as React.CSSProperties}>
        <FilesIcon aria-hidden />
      </Button>
    </Tooltip>
  ),
};

export const WithDynamicCSSTooltipText: Story = {
  args: {
    content: 'Kopier',
  },
  render: () => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [tooltipContent, setTooltipContent] = useState('');

    // Tooltip text from css variable
    useEffect(() => {
      if (typeof window === 'undefined' || !tooltipRef.current) return;
      const content = getComputedStyle(tooltipRef.current)
        .getPropertyValue('--ds-tooltip-content')
        .replace(/^["']|["']$/g, '')
        .trim();
      setTooltipContent(content);
    }, []);

    return (
      <Tooltip content={tooltipContent} ref={tooltipRef}>
        <Button
          style={{ '--ds-tooltip-content': '"Kopier"' } as React.CSSProperties}
        >
          <FilesIcon aria-hidden />
        </Button>
      </Tooltip>
    );
  },
};
