/** A story split into the code worth reading, and what has to be put around it to run it. */
export type StorySource = {
  /** The code shown in the editor */
  code: string;
  /** Turns the code in the editor, edited or not, into code react-live can run */
  toRunnable: (code: string) => string;
};

/** Code that calls `render` itself is run as it is, so a whole example can be pasted in */
const CALLS_RENDER = /^render\(/m;

const dedent = (code: string) => {
  const lines = code.split('\n');
  const indents = lines
    .filter((line) => line.trim())
    .map((l) => l.search(/\S/));
  const indent = Math.min(...indents);
  return lines.map((line) => line.slice(indent)).join('\n');
};

/** The JSX a component returns, when returning it is the only thing the component does. */
const getOnlyJsx = (story: string, name: string) => {
  const start = `const ${name} = () => `;
  if (!story.startsWith(start)) return;
  const body = story.slice(start.length);

  // `{ return <jsx>; };` or `<jsx>;`
  const returned =
    /^\{\n\s*return\s([\s\S]*);\n\};$/.exec(body) ??
    /^([^{][\s\S]*);$/.exec(body);
  if (!returned) return;

  // `(<jsx>)` over several lines
  const wrapped = /^\(\n([\s\S]*)\n\s*\)$/.exec(returned[1]);
  const jsx = wrapped ? dedent(wrapped[1]) : returned[1].trim();

  if (!jsx.startsWith('<') || !jsx.endsWith('>')) return;

  // We run it in a fragment of our own, so one around all of it says nothing
  const fragment = /^<>\n([\s\S]*)\n<\/>$/.exec(jsx);
  return fragment ? dedent(fragment[1]) : jsx;
};

/**
 * Stories are written as components, but most of them only return some JSX. For those the JSX
 * is all we show. A story that does more than that, like keeping state, is shown as the
 * component it is, without the `render` call that puts it on the page.
 *
 * @param story - The component as written in a *.stories.tsx file, without `export`
 * @param name - The name of that component
 */
export const getStorySource = (story: string, name: string): StorySource => {
  const component = story.trim();
  const jsx = getOnlyJsx(component, name);

  if (jsx !== undefined) {
    return {
      code: jsx,
      // In a fragment so siblings can be added, and on the first line so that the line numbers
      // of errors are those of the editor
      toRunnable: (code) =>
        CALLS_RENDER.test(code) ? code : `render(<>${code}\n</>)`,
    };
  }

  return {
    code: component,
    toRunnable: (code) =>
      CALLS_RENDER.test(code) ? code : `${code}\n\nrender(<${name} />)`,
  };
};
