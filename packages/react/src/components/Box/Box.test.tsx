import { render as renderRtl, screen } from '@testing-library/react';

import { Box } from './Box';

type BoxProps = Parameters<typeof Box>['0'];

const render = (props?: BoxProps) =>
  renderRtl(
    <Box
      {...props}
      title='box'
    />,
  );

const renderAsChild = (props?: BoxProps) =>
  renderRtl(
    <Box
      {...props}
      asChild
      title='box'
    >
      <button>child</button>
    </Box>,
  );

describe('Box', () => {
  it('should render a div with correct classname when shadow is xsmall', () => {
    render({ shadow: 'xsmall' });
    const box = screen.getByTitle('box');

    expect(box.classList).toContain('fds-box--xsmall-shadow');
  });

  it('should render a div with correct classname when borderColor is subtle', () => {
    render({ borderColor: 'subtle' });
    const box = screen.getByTitle('box');

    expect(box.classList).toContain('fds-box--subtle-border-color');
  });

  it('should render a div with correct classname when borderRadius is small', () => {
    render({ borderRadius: 'small' });
    const box = screen.getByTitle('box');

    expect(box.classList).toContain('fds-box--small-border-radius');
  });

  it('should render as a button when we use asChild', () => {
    renderAsChild();
    const box = screen.getByTitle('box');

    expect(box.tagName).toBe('BUTTON');
  });
});
