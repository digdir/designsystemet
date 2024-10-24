import type { Decorator } from '@storybook/react';

/**
 * This decorator is used to customize the style of the root story element.
 * It is useful for customizing the layout, or when you need to account
 * for elements that would otherwise not be visible in Chromatic's visual snapshots.
 *
 * The decorator is added globally, and can be configured through `parameters.customStyles`
 * at the meta or story level. E.g.
 * ```ts
 * parameters: {
 *   customStyles: {
 *     // These apply both in docs mode and story mode
 *     display: 'flex',
 *     gap: '8px',
 *     docs: {
 *       // These apply only when the story renders in a docs page
 *       height: '200px'
 *     },
 *     story: {
 *       // These apply only when the story is viewed individually
 *       height: '100vh'
 *     }
 *   }
 * }
 * ```
 *
 * By default, the decorator sets `overflow: hidden` so you can see in Storybook exactly
 * what Chromatic's snapshot will be, and `padding: 1rem` to account for most overflowing
 * elements like focus styles, badges etc.
 *
 * From Chromatic's documentation:
 * > Snapshots can sometimes exclude outline and other focus styles because Chromatic
 * > trims each snapshot to the dimensions of the root node of the story. To capture
 * > those styles, wrap the story in a decorator that adds slight padding.
 */
export const customStylesDecorator: Decorator = (Story, ctx) => {
  const { docs, story, ...style } = ctx.parameters.customStyles ?? {};
  /* get data-size */
  const size = ctx.args['data-size'];

  return (
    <div
      className='storybook-decorator'
      style={{
        overflow: 'hidden',
        padding: '1rem',
        ...style,
        ...(ctx.viewMode === 'docs' && docs),
        ...(ctx.viewMode === 'story' && story),
      }}
      data-size={size}
    >
      <Story />
    </div>
  );
};
