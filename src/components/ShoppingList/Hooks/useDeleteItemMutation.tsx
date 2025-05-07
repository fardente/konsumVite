import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IShoppingListItem } from '../../../domain/api';
import { deleteShoppingItem } from '../../../domain/firestoreApi';

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemID: string) => deleteShoppingItem(itemID),
    onMutate: async (itemID: string) => {
      await queryClient.cancelQueries({ queryKey: ['shoppingItems'] });

      const prev: IShoppingListItem[] | undefined = queryClient.getQueryData([
        'shoppingItems',
      ]);

      queryClient.setQueryData<IShoppingListItem[] | undefined>(
        ['shoppingItems'],
        oldItems => {
          if (oldItems) {
            return oldItems.filter(item => {
              if (item.id !== itemID) {
                return item;
              }
            });
          }
        }
      );

      return { prev };
    },
    onError: (err, _, context) => {
      console.log('Error deleting item:', err);
      console.log('Previous items:', context);
      if (context) {
        queryClient.setQueryData(['shoppingItems'], context.prev);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shoppingItems']);
    },
  });
};
