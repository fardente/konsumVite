import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IUpdateRecipeForm } from '../../../domain/api';
import { updateRecipe } from '../../../domain/firestoreApi';

export const useUpdateRecipeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipe: IUpdateRecipeForm) => updateRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe'] });
    },
  });
};
