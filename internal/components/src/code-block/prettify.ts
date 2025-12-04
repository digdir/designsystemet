import parserBabel from 'prettier/plugins/babel';
import parserEstree from 'prettier/plugins/estree';
import parserHtml from 'prettier/plugins/html';
import parserMarkdown from 'prettier/plugins/markdown';
import parserPostcss from 'prettier/plugins/postcss';
import parserTypescript from 'prettier/plugins/typescript';
import * as prettier from 'prettier/standalone';

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
  plugins: unknown[];
}

const languageParserMap: Record<SupportedLanguage, LanguageConfig> = {
  json: {
    parser: 'json',
    plugins: [parserBabel, parserEstree],
  },
  javascript: {
    parser: 'babel',
    plugins: [parserBabel, parserEstree],
  },
  js: {
    parser: 'babel',
    plugins: [parserBabel, parserEstree],
  },
  typescript: {
    parser: 'typescript',
    plugins: [parserTypescript, parserEstree],
  },
  ts: {
    parser: 'typescript',
    plugins: [parserTypescript, parserEstree],
  },
  jsx: {
    parser: 'babel',
    plugins: [parserBabel, parserEstree],
  },
  tsx: {
    parser: 'typescript',
    plugins: [parserTypescript, parserEstree],
  },
  css: {
    parser: 'css',
    plugins: [parserPostcss],
  },
  scss: {
    parser: 'scss',
    plugins: [parserPostcss],
  },
  less: {
    parser: 'less',
    plugins: [parserPostcss],
  },
  html: {
    parser: 'html',
    plugins: [parserHtml],
  },
  markdown: {
    parser: 'markdown',
    plugins: [parserMarkdown],
  },
  md: {
    parser: 'markdown',
    plugins: [parserMarkdown],
  },
  yaml: {
    parser: 'yaml',
    plugins: [parserBabel],
  },
  yml: {
    parser: 'yaml',
    plugins: [parserBabel],
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
    const formatted = await prettier.format(code, {
      parser: config.parser,
      // biome-ignore lint: Prettier plugin types are complex and vary
      plugins: config.plugins as any,
    });
    return formatted;
  } catch (error) {
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
