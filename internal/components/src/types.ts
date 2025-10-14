export type QuickResult = {
  title: string;
  content: string;
  url: string;
  type: 'component' | 'guide' | 'pattern' | 'blog';
  sources?: { title: string; url: string }[];
};

export type SmartResult = {
  content: string;
  sources: { title: string; url: string }[];
};

export type OnSearch = (query: string) => Promise<{
  success: boolean;
  results: QuickResult[];
  query: string;
  error?: string;
}>;

export type OnAiSearch = (query: string) => Promise<{
  success: boolean;
  result: SmartResult;
  query: string;
  error?: string;
}>;
