import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRecipeImage } from '../../../domain/firestoreApi';

export const useUpdateRecipeImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recipe_name, file }: { recipe_name: string; file: File }) =>
      updateRecipeImage(recipe_name, file),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', data.recipe_name] });
    },
  });
};
