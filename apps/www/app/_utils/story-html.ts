/** A story from a *.stories.tsx / *.dodont.tsx file, as the loaders return it */
export type RenderedStory = {
  name: string;
  code: string;
  /** The story rendered to HTML */
  html?: string;
  /** Why there is no `html` */
  htmlError?: string;
};

/**
 * Loaders render every export of a stories file, but only the ones a page shows have to work.
 */
export const getStoryHtml = (story: RenderedStory) => {
  if (story.html === undefined) {
    throw new Error(
      `Could not render story "${story.name}": ${story.htmlError}`,
    );
  }
  return story.html;
};
