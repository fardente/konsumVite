import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeTagFromShoppingItem } from '../../../domain/firestoreApi';
import { ShoppingItem } from '../../../domain/shoppingItem';

export const useRemoveTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, tag }: { itemId: string; tag: string }) =>
      removeTagFromShoppingItem(itemId, tag),
    onMutate: async ({
      itemId,
      tag: tagToRemove,
    }: {
      itemId: string;
      tag: string;
    }) => {
      // Cancel any outgoing queries for 'shoppingItems' to avoid overwriting optimistic updates
      await queryClient.cancelQueries({ queryKey: ['shoppingItems'] });
      // Snapshot the previous state
      const previousItems = queryClient.getQueryData<ShoppingItem[]>([
        'shoppingItems',
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<ShoppingItem[] | undefined>(
        ['shoppingItems'],
        oldItems => {
          if (!oldItems) return oldItems;

          return oldItems.map(item => {
            if (item.name_lowercase === itemId.toLowerCase()) {
              item.removeTag(tagToRemove);
            }
            return item;
          });
        }
      );
      // Return the previous state to rollback in case of an error
      return { previousItems };
    },
    onError: (err, variables, context) => {
      console.error('Error adding tag:', err);

      // Rollback to the previous state
      // if (context?.previousItems) {
      //   queryClient.setQueryData(['shoppingItems'], context.previousItems);
      // }
    },
    onSuccess: () => {
      // queryClient.invalidateQueries(['shoppingItems']);
    },
  });
};
