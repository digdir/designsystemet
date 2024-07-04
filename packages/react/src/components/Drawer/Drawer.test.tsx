import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer, DrawerProps } from './Drawer';

const TRIGGER_TEXT = 'Open Drawer';
const DRAWER_CONTENT = 'Drawer Content';
const DRAWER_TITLE = 'Drawer Title';

const TestComponent = (props: Partial<DrawerProps>) => (
  <Drawer
    trigger={<button>{TRIGGER_TEXT}</button>}
    {...props}
  >
    {DRAWER_CONTENT}
  </Drawer>
);

const render = async (props: Partial<DrawerProps> = {}) => {
  await act(async () => {});
  const user = userEvent.setup();
  return {
    user,
    ...renderRtl(<TestComponent {...props} />),
  };
};

describe('Drawer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the trigger', async () => {
    await render();
    expect(screen.getByText(TRIGGER_TEXT)).toBeInTheDocument();
  });

  it('should open the drawer', async () => {
    const { user } = await render();
    const trigger = screen.getByText(TRIGGER_TEXT);
    await user.click(trigger);
    expect(screen.getByText(DRAWER_CONTENT)).toBeInTheDocument();
  });

  it('should close the drawer', async () => {
    const { user } = await render();
    const trigger = screen.getByText(TRIGGER_TEXT);
    await user.click(trigger);
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(screen.queryByText(DRAWER_CONTENT)).not.toBeInTheDocument();
  });

  it('should use custom aria-label for close button', async () => {
    const customLabel = 'Custom Close Label';
    await render({ arialabelCloseDrawer: customLabel });
    const trigger = screen.getByText(TRIGGER_TEXT);
    await userEvent.click(trigger);
    expect(screen.getByLabelText(customLabel)).toBeInTheDocument();
  });

  it('should not render trigger when not provided', async () => {
    await render({ trigger: undefined });
    expect(screen.queryByText(TRIGGER_TEXT)).not.toBeInTheDocument();
  });

  it('should autofocus on close button when opened', async () => {
    const { user } = await render();
    const trigger = screen.getByText(TRIGGER_TEXT);
    await user.click(trigger);

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveFocus();
  });
});
