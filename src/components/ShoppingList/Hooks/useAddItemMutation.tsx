import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IShoppingListItem } from '../../../domain/api';
import {
  IAddShoppingItem,
  addShoppingItem,
} from '../../../domain/firestoreApi';

export const useAddItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: IAddShoppingItem) => addShoppingItem(item),
    onMutate: async (item: IAddShoppingItem) => {
      await queryClient.cancelQueries({ queryKey: ['shoppingItems'] });

      const prev: IShoppingListItem[] | undefined = queryClient.getQueryData([
        'shoppingItems',
      ]);

      queryClient.setQueryData<IShoppingListItem[] | undefined>(
        ['shoppingItems'],
        oldItems => {
          if (oldItems) {
            const newItems = [
              ...oldItems.filter(
                existingItem =>
                  existingItem.id.toLowerCase() !== item.name.toLowerCase()
              ),
              {
                id: item.name,
                name: item.name,
                onList: true,
                checked: false,
                tags: item.tags || [],
                updated: Date.now(),
              },
            ];
            return newItems;
          }
        }
      );

      return { prev };
    },

    onError: (err, _, context) => {
      console.log('Error adding item:', err);
      console.log('Previous items:', context);
      if (context) {
        queryClient.setQueryData(['shoppingItems'], context.prev);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingItems'] });
    },
  });
};
