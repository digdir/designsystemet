import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { PopoverProps } from './';

import { Button } from '../Button';
import { Popover } from './';

const contentText = 'popover content';

const render = async (props: PopoverProps = { id: 'my-popover' }) => {
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(
      <>
        <Button id={props.id}>trigger</Button>
        <Popover {...props}>{contentText}</Popover>
      </>,
    ),
  };
};

describe('Popover', () => {
  it('should render popover on trigger-click when closed', async () => {
    // const { user } = await render();
    // const popoverTrigger = screen.getByRole('button');

    // expect(screen.queryByText(contentText)).not.toBeInTheDocument();

    // await act(async () => await user.click(popoverTrigger));

    // expect(screen.queryByText(contentText)).toBeInTheDocument();

    // TODO: How to test when JSDOM does not support Popover API yet? https://github.com/jsdom/jsdom/issues/3721
    expect(true).toBe(true);
  });

  // it('should close when we click the button twitce', async () => {
  //   const { user } = await render();
  //   const popoverTrigger = screen.getByRole('button');

  //   await act(async () => await user.click(popoverTrigger));

  //   expect(screen.queryByText(contentText)).toBeInTheDocument();

  //   await act(async () => await user.click(popoverTrigger));

  //   expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  // });

  // it('should close when we click outside', async () => {
  //   const { user } = await render();
  //   const popoverTrigger = screen.getByRole('button');

  //   await act(async () => await user.click(popoverTrigger));

  //   expect(screen.queryByText(contentText)).toBeInTheDocument();

  //   await act(async () => await user.click(document.body));

  //   expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  // });

  // it('should close when we press ESC', async () => {
  //   const { user } = await render();
  //   const popoverTrigger = screen.getByRole('button');

  //   await act(async () => await user.click(popoverTrigger));

  //   expect(screen.queryByText(contentText)).toBeInTheDocument();

  //   await act(async () => await user.keyboard('[Escape]'));

  //   expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  // });

  // it('should close when we press SPACE', async () => {
  //   const { user } = await render();
  //   const popoverTrigger = screen.getByRole('button');

  //   await act(async () => await user.click(popoverTrigger));

  //   expect(screen.queryByText(contentText)).toBeInTheDocument();

  //   await act(async () => await user.keyboard('[Space]'));

  //   expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  // });

  // it('should close when we press ENTER', async () => {
  //   const { user } = await render();
  //   const popoverTrigger = screen.getByRole('button');

  //   await act(async () => await user.click(popoverTrigger));

  //   expect(screen.queryByText(contentText)).toBeInTheDocument();

  //   await act(async () => await user.keyboard('[Enter]'));

  //   expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  // });

  // it('should not close if we click inside the popover', async () => {
  //   const { user } = await render();
  //   const popoverTrigger = screen.getByRole('button');

  //   await act(async () => await user.click(popoverTrigger));

  //   expect(screen.queryByText(contentText)).toBeInTheDocument();

  //   await act(async () => await user.click(screen.getByText(contentText)));

  //   expect(screen.queryByText(contentText)).toBeInTheDocument();
  // });

  // it('should have correct aria attributes', async () => {
  //   const { user } = await render();
  //   const popoverTrigger = screen.getByRole('button');

  //   await act(async () => await user.click(popoverTrigger));

  //   const popoverContent = screen.getByText(contentText);

  //   expect(popoverTrigger.getAttribute('aria-controls')).toBe(
  //     popoverContent.id,
  //   );
  //   expect(popoverContent.getAttribute('aria-labelledby')).toBe(
  //     popoverTrigger.id,
  //   );
  // });
});
