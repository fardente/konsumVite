import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addShoppingItem } from '../../../domain/firestoreApi';
import { ShoppingItem } from '../../../domain/shoppingItem';

export const useAddItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => addShoppingItem(name),
    onMutate: async item => {
      await queryClient.cancelQueries({ queryKey: ['shoppingItems'] });

      const prev: ShoppingItem[] | undefined = queryClient.getQueryData([
        'shoppingItems',
      ]);
      queryClient.setQueryData<ShoppingItem[] | undefined>(
        ['shoppingItems'],
        oldItems => {
          if (oldItems) {
            const newItems = [
              ...oldItems.filter(
                existingItem =>
                  existingItem.name_lowercase !== item.toLowerCase()
              ),
              new ShoppingItem(item),
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
