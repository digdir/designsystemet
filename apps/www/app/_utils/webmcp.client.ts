/**
 * WebMCP integration – exposes the site's key actions (documentation search,
 * component listing, navigation and page reading) as tools AI agents can call
 * through the browser's Model Context API.
 *
 * The API surface differs between the spec draft (`document.modelContext`) and
 * Chrome's early preview (`navigator.modelContext`), so we feature-detect both
 * and register through `provideContext` when available, falling back to
 * `registerTool`.
 *
 * @see https://webmachinelearning.github.io/webmcp/
 * @see https://developer.chrome.com/blog/webmcp-epp
 */

type WebMcpToolResult = {
  content: { type: 'text'; text: string }[];
};

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
  };
  execute: (
    input: Record<string, unknown>,
  ) => WebMcpToolResult | Promise<WebMcpToolResult>;
};

type ModelContext = {
  provideContext?: (context: { tools: WebMcpTool[] }) => void;
  registerTool?: (tool: WebMcpTool) => void | Promise<void>;
};

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
  interface Document {
    modelContext?: ModelContext;
  }
}

/* Full page loads also work, but SPA navigation lets the tool call resolve and
 * return its result to the agent instead of being cut off by the unload.
 * Upgraded to the react-router navigate function once the app has hydrated. */
let navigateImpl: (to: string) => void = (to) => window.location.assign(to);

export function setWebMcpNavigate(navigate: (to: string) => void) {
  navigateImpl = navigate;
}

const textResult = (value: unknown): WebMcpToolResult => ({
  content: [
    {
      type: 'text',
      text: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
    },
  ],
});

/* Kept in sync with the <html lang> attribute by i18next */
const currentLang = (): 'en' | 'no' =>
  document.documentElement.lang === 'en' ? 'en' : 'no';

const langFromInput = (input: Record<string, unknown>): 'en' | 'no' =>
  input.lang === 'en' || input.lang === 'no' ? input.lang : currentLang();

const langInputSchema = {
  type: 'string',
  enum: ['no', 'en'],
  description:
    'Language of the documentation, "no" (Norwegian) or "en" (English). Defaults to the current page language.',
};

type SearchResponse = {
  results: {
    title: string;
    description: string;
    url: string;
    type: string;
  }[];
};

const fetchSearchResults = async (params: URLSearchParams) => {
  const response = await fetch(`/api/search?${params}`);
  if (!response.ok) {
    return textResult(`Search request failed with status ${response.status}.`);
  }

  const { results } = (await response.json()) as SearchResponse;
  if (results.length === 0) {
    return textResult('No results found.');
  }

  return textResult(
    results.map((result) => ({
      title: result.title,
      description: result.description,
      type: result.type,
      url: new URL(result.url, window.location.origin).href,
    })),
  );
};

const buildTools = (): WebMcpTool[] => [
  {
    name: 'search-documentation',
    description:
      'Search the Designsystemet documentation. Finds components, fundamentals (design tokens, theming), patterns, best practices and blog posts. Returns matching pages with title, description and URL.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Search terms, e.g. "button", "design tokens" or "accessibility".',
        },
        lang: langInputSchema,
      },
      required: ['query'],
    },
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      const query = String(input.query ?? '').trim();
      if (!query) {
        return textResult('The "query" input is required.');
      }

      return fetchSearchResults(
        new URLSearchParams({ q: query, lang: langFromInput(input) }),
      );
    },
  },
  {
    name: 'list-components',
    description:
      'List all UI components in Designsystemet, each with a short description and a link to its documentation.',
    inputSchema: {
      type: 'object',
      properties: {
        lang: langInputSchema,
      },
    },
    annotations: { readOnlyHint: true },
    execute: async (input) =>
      fetchSearchResults(
        new URLSearchParams({ type: 'component', lang: langFromInput(input) }),
      ),
  },
  {
    name: 'open-page',
    description:
      'Navigate the browser to a page on this site, e.g. a URL returned by search-documentation or list-components.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description:
            'Path (e.g. "/no/components/docs/button/overview") or full URL on this site.',
        },
      },
      required: ['url'],
    },
    execute: (input) => {
      const raw = String(input.url ?? '');

      let target: URL;
      try {
        target = new URL(raw, window.location.origin);
      } catch {
        return textResult(`"${raw}" is not a valid URL.`);
      }

      if (target.origin !== window.location.origin) {
        return textResult(
          `Only pages on ${window.location.origin} can be opened.`,
        );
      }

      navigateImpl(target.pathname + target.search + target.hash);
      return textResult(`Navigated to ${target.pathname}.`);
    },
  },
  {
    name: 'get-page-content',
    description: "Get the current page's URL, title and readable text content.",
    inputSchema: {
      type: 'object',
      properties: {},
    },
    annotations: { readOnlyHint: true },
    execute: () => {
      const main = document.querySelector('main');
      return textResult({
        url: window.location.href,
        title: document.title,
        content: (main ?? document.body).innerText.slice(0, 8000),
      });
    },
  },
];

let registered = false;

export function registerWebMcpTools() {
  const modelContext = navigator.modelContext ?? document.modelContext;
  if (!modelContext || registered) return;
  registered = true;

  const tools = buildTools();

  if (typeof modelContext.provideContext === 'function') {
    modelContext.provideContext({ tools });
  } else if (typeof modelContext.registerTool === 'function') {
    for (const tool of tools) {
      void modelContext.registerTool(tool);
    }
  }
}
