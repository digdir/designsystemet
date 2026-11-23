import { createElement, useContext, useEffect } from 'react';
import { LiveContext } from 'react-live';

type HtmlCaptureProps = {
  /** Called with the HTML of the edited code, or `undefined` when the code is as written */
  onHtmlCapture: (html: string | undefined) => void;
};

/**
 * Renders nothing. Captures the HTML of edited code using renderToString, which gives us the
 * HTML that React produces before hydration rather than the DOM after client-side rendering.
 */
export const HtmlCapture = ({ onHtmlCapture }: HtmlCaptureProps) => {
  const { element: Element, code, newCode } = useContext(LiveContext);
  const isEdited = newCode !== undefined && newCode !== code;

  useEffect(() => {
    // The loader has already rendered the story as it was written
    if (!isEdited) return onHtmlCapture(undefined);
    if (!Element) return;

    let isCurrent = true;
    // Only needed once someone edits, so it isn't part of what every page loads
    import('react-dom/server').then(({ renderToString }) => {
      if (!isCurrent) return;
      try {
        onHtmlCapture(renderToString(createElement(Element)));
      } catch {
        onHtmlCapture('Unable to render HTML');
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [Element, isEdited, onHtmlCapture]);

  return null;
};
