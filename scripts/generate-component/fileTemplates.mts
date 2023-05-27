// Content for export file
const exportContent = (componentName: string) => {
  return `export { ${componentName} } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';
`;
};

// Content for tsx file
const mainContent = (componentName: string) => {
  return `import React from 'react';

import classes from './${componentName}.module.css';

type ${componentName}Props = {
  children: React.ReactNode;
};

const ${componentName} = ({ children }: ${componentName}Props) => {
  return <div className={classes.myClass}>{children}</div>;
};

export { ${componentName} };
export type { ${componentName}Props };
`;
};

const cssContent = (componentName: string) => {
  return `.myClass {
  color: red;
}
`;
};

export { exportContent, mainContent, cssContent };
