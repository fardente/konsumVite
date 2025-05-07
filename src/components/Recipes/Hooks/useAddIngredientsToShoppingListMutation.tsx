import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMultipleShoppingItems } from '../../../domain/firestoreApi';

type TAddIngredientsToShoppingList = {
  ingredients: string[];
  recipeName: string;
};

export const useAddIngredientsToShoppingListMutation = () => {
  return useMutation({
    mutationFn: (ingredients: TAddIngredientsToShoppingList) => {
      const items = ingredients.ingredients.map(item => ({
        name: item,
        tags: [ingredients.recipeName],
      }));
      return addMultipleShoppingItems(items);
    },
    onError: (err, _, context) => {
      console.log('Error adding ingredients:', err);
    },
  });
};
