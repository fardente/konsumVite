import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRecipe } from '../../../domain/firestoreApi';
import { Recipe } from '../../../domain/recipe';

export const useUpdateRecipeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipe: Recipe) => updateRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe'] });
    },
  });
};
