import type { QuickResult, SmartResult } from '@internal/components/src/types';
import { useCallback, useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import type { action as aiSearchAction } from '~/routes/api/ai-search';
import type { action as searchAction } from '~/routes/api/search';

type PendingRequest<T> = {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
};

type SearchPromiseReturn = {
  success: boolean;
  results: QuickResult[];
  query: string;
  error?: string;
};

type SearchPromise = (query: string) => Promise<SearchPromiseReturn>;

type AiSearchPromiseReturn = {
  success: boolean;
  result: SmartResult;
  query: string;
  error?: string;
};

type AiSearchPromise = (query: string) => Promise<AiSearchPromiseReturn>;

export const useSearch = () => {
  const searchFetcher = useFetcher<typeof searchAction>();
  const aiSearchFetcher = useFetcher<typeof aiSearchAction>();
  const pendingSearchRef = useRef<PendingRequest<SearchPromiseReturn> | null>(
    null,
  );
  const pendingAiSearchRef =
    useRef<PendingRequest<AiSearchPromiseReturn> | null>(null);

  useEffect(() => {
    if (searchFetcher.state === 'idle' && pendingSearchRef.current) {
      clearTimeout(pendingSearchRef.current.timeout);

      if (searchFetcher.data) {
        pendingSearchRef.current.resolve(searchFetcher.data);
      } else {
        pendingSearchRef.current.reject(
          new Error('Search request failed or returned no data.'),
        );
      }
      pendingSearchRef.current = null;
    }
  }, [searchFetcher.state, searchFetcher.data]);

  useEffect(() => {
    if (aiSearchFetcher.state === 'idle' && pendingAiSearchRef.current) {
      clearTimeout(pendingAiSearchRef.current.timeout);

      if (aiSearchFetcher.data) {
        pendingAiSearchRef.current.resolve(aiSearchFetcher.data);
      } else {
        pendingAiSearchRef.current.reject(
          new Error('AI search request failed or returned no data.'),
        );
      }
      pendingAiSearchRef.current = null;
    }
  }, [aiSearchFetcher.state, aiSearchFetcher.data]);

  const handleSearch: SearchPromise = useCallback(
    (query: string) => {
      if (pendingSearchRef.current) {
        clearTimeout(pendingSearchRef.current.timeout);
        pendingSearchRef.current.reject(new Error('Request cancelled'));
        pendingSearchRef.current = null;
      }

      const promise = new Promise<SearchPromiseReturn>((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (pendingSearchRef.current) {
            pendingSearchRef.current = null;
            reject(new Error('Search request timed out'));
          }
        }, 30000);

        pendingSearchRef.current = { resolve, reject, timeout };

        searchFetcher.submit(
          { query },
          { method: 'post', action: '/api/search' },
        );
      });

      return promise;
    },
    [searchFetcher],
  );

  const handleAiSearch: AiSearchPromise = useCallback(
    (query: string) => {
      if (pendingAiSearchRef.current) {
        clearTimeout(pendingAiSearchRef.current.timeout);
        pendingAiSearchRef.current.reject(new Error('Request cancelled'));
        pendingAiSearchRef.current = null;
      }

      const promise = new Promise<AiSearchPromiseReturn>((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (pendingAiSearchRef.current) {
            pendingAiSearchRef.current = null;
            reject(new Error('AI search request timed out'));
          }
        }, 30000);

        pendingAiSearchRef.current = { resolve, reject, timeout };

        aiSearchFetcher.submit(
          { query },
          { method: 'post', action: '/api/ai-search' },
        );
      });

      return promise;
    },
    [aiSearchFetcher],
  );

  useEffect(() => {
    return () => {
      if (pendingSearchRef.current) {
        clearTimeout(pendingSearchRef.current.timeout);
        pendingSearchRef.current.reject(new Error('Component unmounted'));
        pendingSearchRef.current = null;
      }
      if (pendingAiSearchRef.current) {
        clearTimeout(pendingAiSearchRef.current.timeout);
        pendingAiSearchRef.current.reject(new Error('Component unmounted'));
        pendingAiSearchRef.current = null;
      }
    };
  }, []);

  return {
    handleSearch,
    handleAiSearch,
  };
};
