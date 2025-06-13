import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRecipeImage } from '../../../domain/firestoreApi';

export const useUpdateRecipeImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recipe_name,
      file,
    }: {
      recipe_name: string;
      file: Blob | Uint8Array | ArrayBuffer;
    }) => updateRecipeImage(recipe_name, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['updaterecipes'] });
    },
  });
};
