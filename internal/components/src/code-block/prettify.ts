/*
 * Prettier and its parser plugins are large (several MB), so they're loaded on first use instead of with the page.
 * Only the plugins for the language being formatted are loaded.
 */
const babel = () => import('prettier/plugins/babel');
const estree = () => import('prettier/plugins/estree');
const html = () => import('prettier/plugins/html');
const markdown = () => import('prettier/plugins/markdown');
const postcss = () => import('prettier/plugins/postcss');
const typescript = () => import('prettier/plugins/typescript');
const yaml = () => import('prettier/plugins/yaml');

type SupportedLanguage =
  | 'json'
  | 'javascript'
  | 'js'
  | 'typescript'
  | 'ts'
  | 'jsx'
  | 'tsx'
  | 'css'
  | 'scss'
  | 'less'
  | 'html'
  | 'markdown'
  | 'md'
  | 'yaml'
  | 'yml';

interface LanguageConfig {
  parser: string;
  plugins: (() => Promise<unknown>)[];
}

const languageParserMap: Record<SupportedLanguage, LanguageConfig> = {
  json: {
    parser: 'json',
    plugins: [babel, estree],
  },
  javascript: {
    parser: 'babel',
    plugins: [babel, estree],
  },
  js: {
    parser: 'babel',
    plugins: [babel, estree],
  },
  typescript: {
    parser: 'typescript',
    plugins: [typescript, estree],
  },
  ts: {
    parser: 'typescript',
    plugins: [typescript, estree],
  },
  jsx: {
    parser: 'babel',
    plugins: [babel, estree],
  },
  tsx: {
    parser: 'typescript',
    plugins: [typescript, estree],
  },
  css: {
    parser: 'css',
    plugins: [postcss],
  },
  scss: {
    parser: 'scss',
    plugins: [postcss],
  },
  less: {
    parser: 'less',
    plugins: [postcss],
  },
  html: {
    parser: 'html',
    plugins: [html],
  },
  markdown: {
    parser: 'markdown',
    plugins: [markdown],
  },
  md: {
    parser: 'markdown',
    plugins: [markdown],
  },
  yaml: {
    parser: 'yaml',
    plugins: [yaml],
  },
  yml: {
    parser: 'yaml',
    plugins: [yaml],
  },
};

/**
 * Prettifies code using Prettier.
 * @param code - The code string to format
 * @param language - The language of the code
 * @returns Promise that resolves to the formatted code, or the original code if formatting fails or language is not supported
 */
export async function prettifyCode(
  code: string,
  language: string,
): Promise<string> {
  const config = languageParserMap[language as SupportedLanguage];

  // If language is not supported, return original code
  if (!config) {
    return code;
  }

  try {
    const [prettier, ...plugins] = await Promise.all([
      import('prettier/standalone'),
      ...config.plugins.map((load) => load()),
    ]);
    const formatted = await prettier.format(code, {
      parser: config.parser,
      // biome-ignore lint: Prettier plugin types are complex and vary
      plugins: plugins as any,
    });
    return formatted;
  } catch (_error) {
    // If formatting fails, return original code
    return code;
  }
}

/**
 * Checks if a language is supported for prettification
 */
export function isPrettifySupported(language: string): boolean {
  return language in languageParserMap;
}
