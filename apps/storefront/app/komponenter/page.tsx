import { ComponentCard } from '@components';

import { isProduction } from 'utils/is-production';
import { data } from './component-list';

const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));

const IS_NEXT_BRANCH = !isProduction();

/* If we are in the next branch, send us to the next storybook */
if (IS_NEXT_BRANCH) {
  for (const component of sortedData) {
    component.url = component.url.replace(
      'storybook.designsystemet.no',
      'next.storybook.designsystemet.no',
    );
  }
}

export default function page() {
  return (
    <>
      {sortedData.map((component) => (
        <ComponentCard key={component.title} {...component} />
      ))}
    </>
  );
}
