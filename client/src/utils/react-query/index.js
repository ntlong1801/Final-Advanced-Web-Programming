import { QueryClient } from 'react-query';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 0,
      refetchOnWindowFocus: false,
      cacheTime: 2000 * 60,
      staleTime: 0,
    },
  },
});

export default client;
