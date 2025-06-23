import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteShoppingItem } from '../../../domain/firestoreApi';
import { ShoppingItem } from '../../../domain/shoppingItem';

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemID: string) => deleteShoppingItem(itemID),
    onMutate: async (itemID: string) => {
      await queryClient.cancelQueries({ queryKey: ['shoppingItems'] });

      const prev: ShoppingItem[] | undefined = queryClient.getQueryData([
        'shoppingItems',
      ]);

      queryClient.setQueryData<ShoppingItem[] | undefined>(
        ['shoppingItems'],
        oldItems => {
          if (oldItems) {
            return oldItems.filter(item => {
              if (item.name_lowercase !== itemID.toLowerCase()) {
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
      queryClient.invalidateQueries({ queryKey: ['shoppingItems'] });
    },
  });
};
