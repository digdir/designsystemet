import type {
  API,
  FileInfo,
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  TemplateElement,
} from 'jscodeshift';

const replaceInLiteral = (node: string) => {
  if (node.startsWith('fds-')) {
    return node.replace('fds-', 'ds-');
  }
  return node;
};

const replaceInTemplateLiteral = (node: TemplateElement[]) => {
  node.forEach((element) => {
    const value = element.value.raw;
    if (typeof value !== 'string') return;
    element.value.raw = replaceInLiteral(value);
  });
};

const processNode = (node: any) => {
  if (!node) return;
  if (node.type === 'Literal') {
    const value = node.value;
    if (typeof value !== 'string') return;
    node.value = replaceInLiteral(value);
  } else if (node.type === 'TemplateLiteral') {
    replaceInTemplateLiteral(node.quasis);
  } else if (node.type === 'JSXExpressionContainer') {
    const expression = node.expression;
    /* console.log(expression); */
    if (expression.type === 'CallExpression') {
      expression.arguments.forEach(processNode);
      expression.arguments.forEach((e) => console.log(e));
    } else {
      processNode(expression);
    }
  } else if (node.type === 'ConditionalExpression') {
    processNode(node.consequent);
    processNode(node.alternate);
  } else if (node.type === 'BinaryExpression') {
    /* console.log(node); */
    processNode(node.right);
    processNode(node.left);
  } else if (node.type === 'LogicalExpression') {
    processNode(node.right);
    processNode(node.left);
  }
};

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
        processNode(nodePath.value.value);
      });
  });

  return root.toSource({
    quote: 'single',
    trailingComma: false,
  });
}

export default replaceClassNamePrefix;
