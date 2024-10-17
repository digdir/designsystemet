import { type TestRunnerConfig, getStoryContext } from '@storybook/test-runner';
import { checkA11y, configureAxe, injectAxe } from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */

const config: TestRunnerConfig = {
  // Tags to include, exclude, or skip. These tags are defined as annotations in your story or meta.
  tags: {
    exclude: [],
  },
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // Get the entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context);

    /*
     * Accessibility testing
     */

    await configureAxe(page, {
      // Apply a11y rules set through parameters (global, component or story level)
      rules: storyContext.parameters?.a11y?.config?.rules,
    });

    const isA11yDisabled = storyContext.parameters?.a11y?.disable === true;
    if (!isA11yDisabled) {
      await checkA11y(
        page,
        storyContext.parameters?.a11y?.element ?? ['#storybook-root'],
        {
          detailedReport: true,
          detailedReportOptions: {
            html: true,
          },
          verbose: false,
          axeOptions: {},
        },
        false,
        'v2',
      );
    }
  },
};

export default config;
