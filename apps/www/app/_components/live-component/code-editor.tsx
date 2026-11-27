import { HighlightedCode } from '@internal/components';
import cl from 'clsx/lite';
import type { Ref } from 'react';
import classes from './live-component.module.css';

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name of the text field */
  label: string;
  language: string;
  hidden?: boolean;
  onFocus?: () => void;
  /** The text field, e.g. for moving focus to it */
  ref?: Ref<HTMLTextAreaElement>;
};

/**
 * Editable, syntax highlighted code.
 *
 * A plain `<textarea>` holds the text, so the caret, selection, undo and keyboard behave the way
 * the browser and assistive technology expect. Its own text is transparent; the colours come from
 * the same text highlighted underneath it.
 */
export const CodeEditor = ({
  value,
  onChange,
  label,
  language,
  hidden,
  onFocus,
  ref,
}: CodeEditorProps) => (
  <div
    // 'live-editor' is how server/markdown-negotiation.js finds the React source
    className={cl(classes.editor, classes.liveEditor, 'live-editor')}
    hidden={hidden}
  >
    <div aria-hidden='true'>
      <HighlightedCode
        className={classes.code}
        hidden={hidden}
        language={language}
      >
        {/* A trailing newline has no height in a <pre>, but it does in a <textarea> */}
        {`${value}\n`}
      </HighlightedCode>
    </div>
    <textarea
      ref={ref}
      className={cl(classes.code, 'ds-focus--inset')}
      aria-label={label}
      // The code underneath decides the height. The default of two rows is taller than one line of it
      rows={1}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      spellCheck={false}
      autoCapitalize='off'
      autoComplete='off'
      autoCorrect='off'
    />
  </div>
);
