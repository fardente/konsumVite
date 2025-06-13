import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRecipe } from '../../../domain/firestoreApi';

export const useDeleteRecipeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipe_name: string) => deleteRecipe(recipe_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['updaterecipes'] });
    },
  });
};
