import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMultipleShoppingItems } from '../../../domain/firestoreApi';
import { ShoppingItem } from '../../../domain/shoppingItem';

type TAddIngredientsToShoppingList = {
  ingredients: string[];
  recipeName: string;
};

export const useAddIngredientsToShoppingListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredients: TAddIngredientsToShoppingList) => {
      const items = ingredients.ingredients.map(
        item => new ShoppingItem(item, [ingredients.recipeName])
      );
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
