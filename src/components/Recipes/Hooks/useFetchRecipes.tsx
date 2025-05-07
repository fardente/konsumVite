import { useQuery } from '@tanstack/react-query';
import { fetchRecipes } from '../../../domain/firestoreApi';

export const useFetchRecipes = () =>
  useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });
