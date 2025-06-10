import { useQuery } from '@tanstack/react-query';
import { fetchSuggestions } from '../../../domain/firestoreApi';

export const useSuggestionsQuery = (
  input: string,
  onlyOnList: boolean = false
) =>
  useQuery({
    queryKey: ['suggestions', input], // Unique key based on the input
    queryFn: () => fetchSuggestions(input, onlyOnList), // Fetch suggestions based on the input
    enabled: !!input.trim(), // Only fetch if input is not empty
    cacheTime: 0,
    staleTime: 0,
  });
