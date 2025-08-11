import { Popover as PopoverParent } from './popover';
import { PopoverTrigger } from './popover-trigger';
import { PopoverTriggerContext } from './popover-trigger-context';

type Popover = typeof PopoverParent & {
  /**
   * Popover.TriggerContext component, use to wrap a Popover.Trigger and Popover.
   *
   * @example
   * <Popover.TriggerContext>
   *   <Popover.Trigger>Open Popover</Popover.Trigger>
   *   <Popover>
   *     Content
   *   </Popover>
   * </Popover.TriggerContext>
   */
  TriggerContext: typeof PopoverTriggerContext;
  /**
   * PopoverTrigger component, used to trigger a popover.
   *
   * @example
   * <Popover.TriggerContext>
   *   <Popover.Trigger>Open Popover</Popover.Trigger>
   *   <Popover>
   *     Content
   *   </Popover>
   * </Popover.TriggerContext>
   *
   * @example inline
   * <Popover.TriggerContext>
   *   <Paragraph>
   *    We can use it <Popover.Trigger inline={true}>inline</Popover.Trigger>.
   *   </Paragraph>
   *   <Popover>
   *     Content
   *   </Popover>
   * </Popover.TriggerContext>
   */
  Trigger: typeof PopoverTrigger;
};

/**
 * Popover component, used to display content in a popover over an element.
 *
 * @example
 * <Popover.TriggerContext>
 *   <Popover.Trigger>Open Popover</Popover.Trigger>
 *   <Popover>
 *     Content
 *   </Popover>
 * </Popover.TriggerContext>
 */
const PopoverComponent: Popover = Object.assign(PopoverParent, {
  TriggerContext: PopoverTriggerContext,
  Trigger: PopoverTrigger,
});

PopoverComponent.TriggerContext.displayName = 'Popover.TriggerContext';
PopoverComponent.Trigger.displayName = 'Popover.Trigger';

export type { PopoverProps } from './popover';
export type { PopoverTriggerProps } from './popover-trigger';
export type { PopoverTriggerContextProps } from './popover-trigger-context';

export { PopoverComponent as Popover, PopoverTriggerContext, PopoverTrigger };
