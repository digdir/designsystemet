import type { API, FileInfo } from 'jscodeshift';

/**
 * Replace all class prefixes from 'fds-' to 'ds-'
 * @param file
 * @param api
 * @returns
 */
function replaceClassNamePrefix(file: FileInfo, api: API): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.JSXElement).forEach((path) => {
    j(path)
      .find(j.JSXAttribute, { name: { name: 'className' } })
      .forEach((nodePath) => {
        console.log(nodePath.value);
        /* everything that is just a string */
        if (nodePath.value.value?.type === 'Literal') {
          const value = nodePath.value.value.value;
          if (typeof value !== 'string') return;
          if (value.startsWith('fds-')) {
            nodePath.value.value.value = value.replace('fds-', 'ds-');
          }
        }

        /* if the value is a function, get all string paramaters and rename */
        if (nodePath.value.value?.type === 'JSXExpressionContainer') {
          const expression = nodePath.value.value.expression;
          /* Get functions */
          if (expression.type === 'CallExpression') {
            const args = expression.arguments;
            args.forEach((arg) => {
              if (arg.type === 'Literal') {
                const value = arg.value;
                if (typeof value !== 'string') return;
                if (value.startsWith('fds-')) {
                  arg.value = value.replace('fds-', 'ds-');
                }
              }
            });
          }

          if (expression.type === 'TemplateLiteral') {
            expression.quasis.forEach((quasi) => {
              const value = quasi.value.raw;
              if (typeof value !== 'string') return;
              if (value.startsWith('fds-')) {
                quasi.value.raw = value.replace('fds-', 'ds-');
              }
            });
          }
        }
      });
  });

  return root.toSource({
    quote: 'single',
    trailingComma: false,
  });
}

export default replaceClassNamePrefix;
