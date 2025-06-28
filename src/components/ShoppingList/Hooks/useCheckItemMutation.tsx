import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkShoppingItem } from '../../../domain/firestoreApi';
import { ShoppingItem } from '../../../domain/shoppingItem';

export const useCheckItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, checked }: { itemId: string; checked: boolean }) =>
      checkShoppingItem(itemId, checked),
    onMutate: async ({
      itemId,
      checked,
    }: {
      itemId: string;
      checked: boolean;
    }) => {
      await queryClient.cancelQueries({ queryKey: ['shoppingItems'] });

      const prev: ShoppingItem[] | undefined = queryClient.getQueryData([
        'shoppingItems',
      ]);

      queryClient.setQueryData<ShoppingItem[] | undefined>(
        ['shoppingItems'],
        oldItems => {
          if (oldItems) {
            return oldItems.map(item => {
              if (item.name_lowercase == itemId.toLowerCase()) {
                item.checked = checked;
                return item;
              }
              return item;
            });
          }
        }
      );

      return { prev };
    },
    onError: (err, _, context) => {
      console.log('Error checking item:', err);
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
