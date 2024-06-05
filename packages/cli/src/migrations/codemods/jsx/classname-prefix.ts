import type { API, FileInfo, TemplateElement } from 'jscodeshift';

type Expression = {
  type: string;
  arguments?: Node[];
};

type Node = {
  type: string;
  value?: string;
  quasis?: TemplateElement[];
  expression?: Expression;
  consequent?: Node;
  alternate?: Node;
  right?: Node;
  left?: Node;
  test?: Node;
};

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

const processNode = (node: Node) => {
  if (!node) return;

  if (node.type === 'Literal') {
    const value = node.value;
    if (typeof value !== 'string') return;
    node.value = replaceInLiteral(value);
  } else if (node.type === 'StringLiteral') {
    const value = node.value;
    if (typeof value !== 'string') return;
    node.value = replaceInLiteral(value);
  } else if (node.type === 'TemplateLiteral') {
    node.quasis && replaceInTemplateLiteral(node.quasis);
  } else if (node.type === 'JSXExpressionContainer') {
    const expression = node.expression;
    if (!expression) return;
    if (expression.type === 'CallExpression') {
      expression.arguments?.forEach(processNode);
    } else {
      processNode(expression);
    }
  } else if (node.type === 'ConditionalExpression') {
    node.test && processNode(node.test);
    node.consequent && processNode(node.consequent);
    node.alternate && processNode(node.alternate);
  } else if (node.type === 'BinaryExpression') {
    node.right && processNode(node.right);
    node.left && processNode(node.left);
  } else if (node.type === 'LogicalExpression') {
    node.right && processNode(node.right);
    node.left && processNode(node.left);
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
        processNode(nodePath.value.value as Node);
      });
  });

  return root.toSource({
    quote: 'single',
    reuseWhitespace: true,
    wrapColumn: 100,
  });
}

export default replaceClassNamePrefix;
