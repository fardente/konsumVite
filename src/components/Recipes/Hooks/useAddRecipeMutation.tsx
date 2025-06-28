import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IAddRecipeForm } from '../../../domain/interfaces';
import { addRecipe } from '../../../domain/firestoreApi';

export default function useAddRecipeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipe: IAddRecipeForm) => addRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
    onError: (error: any) => {
      console.error('Error adding recipe:', error);
    },
  });
}
