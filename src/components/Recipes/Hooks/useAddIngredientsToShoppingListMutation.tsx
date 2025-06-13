import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMultipleShoppingItems } from '../../../domain/firestoreApi';

type TAddIngredientsToShoppingList = {
  ingredients: string[];
  recipeName: string;
};

export const useAddIngredientsToShoppingListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredients: TAddIngredientsToShoppingList) => {
      const items = ingredients.ingredients.map(item => ({
        name: item,
        tags: [ingredients.recipeName],
      }));
      return addMultipleShoppingItems(items);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', data.recipeName] });
      queryClient.invalidateQueries({ queryKey: ['shoppingItems'] });
    },
    onError: (err, _, context) => {
      console.log('Error adding ingredients:', err);
    },
  });
};
