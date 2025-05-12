import {
  Canvas,
  DocsContext,
  type DocsContextProps,
  type Of,
  useOf,
} from '@storybook/blocks';
import type { Globals, PreparedStory } from '@storybook/types';
import { useContext, useEffect, useState } from 'react';
const GLOBALS_UPDATED = 'globalsUpdated';

// internal Storybook hook, copied from
// https://github.com/storybookjs/storybook/blob/ab212e847c549e03f8555f1907fe84526c9502b7/code/lib/blocks/src/blocks/useGlobals.ts
const useGlobals = (
  story: PreparedStory,
  context: DocsContextProps,
): [Globals] => {
  const storyContext = context.getStoryContext(story);

  const [globals, setGlobals] = useState(storyContext.globals);
  useEffect(() => {
    const onGlobalsUpdated = (changed: { globals: Globals }) => {
      setGlobals(changed.globals);
    };
    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [context.channel]);

  return [globals];
};

export const ReactOrHtmlCanvas = (props: { react: Of; html: Of }) => {
  const { story } = useOf(props.react, ['story']);
  const context = useContext(DocsContext);
  const [globals] = useGlobals(story, context);
  return globals.codePreview === 'html' ? (
    <Canvas of={props.html} />
  ) : (
    <Canvas of={props.react} />
  );
};
