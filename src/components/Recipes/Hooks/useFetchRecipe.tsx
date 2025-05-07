import { useQuery } from '@tanstack/react-query';
import { fetchRecipe } from '../../../domain/firestoreApi';

export const useFetchRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipe(id),
  });
};
