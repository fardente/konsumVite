import { useQuery } from '@tanstack/react-query';
import { fetchSuggestions } from '../../../domain/firestoreApi';

export const useSuggestionsQuery = (input: string) =>
  useQuery({
    queryKey: ['suggestions', input], // Unique key based on the input
    queryFn: () => fetchSuggestions(input), // Fetch suggestions based on the input
    enabled: !!input.trim(), // Only fetch if input is not empty
    staleTime: 1000 * 60, // Cache the results for 1 minute
  });
