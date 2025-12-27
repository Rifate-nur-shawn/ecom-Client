import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      retry: 1, // If API fails, retry once before showing error
      refetchOnWindowFocus: false, // Don't refetch just because I clicked alt-tab
    },
  },
});