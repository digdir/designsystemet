import React, { useEffect } from 'react';
import { Markdown } from '@storybook/blocks';

import classes from './Changelog.module.css';

interface ChangelogProps {
  markdown: string;
}

const Changelog = ({ markdown }: ChangelogProps) => {
  useEffect(() => {
    const bugFixesHeadings: NodeListOf<HTMLElement> =
      window.document.querySelectorAll('#sb-changelog [id=bug-fixes]');
    const featuresHeadings: NodeListOf<HTMLElement> =
      window.document.querySelectorAll('#sb-changelog [id=features]');

    if (bugFixesHeadings !== null) {
      for (let i = 0; i < bugFixesHeadings.length; i++) {
        bugFixesHeadings[i].dataset.bug = '';
      }
    }
    if (featuresHeadings !== null) {
      for (let i = 0; i < featuresHeadings.length; i++) {
        featuresHeadings[i].dataset.feat = '';
      }
    }
  }, []);

  return (
    <div
      className={classes.changelog}
      id='sb-changelog'
    >
      <Markdown>{markdown}</Markdown>
    </div>
  );
};

export { Changelog };
