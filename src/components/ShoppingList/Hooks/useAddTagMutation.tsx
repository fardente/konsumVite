import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTagToShoppingItem } from '../../../domain/firestoreApi';
import { ShoppingItem } from '../../../domain/shoppingItem';

export const useAddTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, tag }: { itemId: string; tag: string }) => {
      return addTagToShoppingItem(itemId, tag.toLowerCase());
    },
    onMutate: async ({ itemId, tag }: { itemId: string; tag: string }) => {
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
              item.addTag(tag);
            }
            return item;
          });
        }
      );

      // Return the previous state to rollback in case of an error
      return { previousItems };
    },
    onError: (err, variables, context) => {
      // Rollback to the previous state
      if (context?.previousItems) {
        queryClient.setQueryData(['shoppingItems'], context.previousItems);
      }
    },
    onSuccess: () => {
      // Invalidate the query to ensure the cache is in sync with the server
      queryClient.invalidateQueries({ queryKey: ['shoppingItems'] });
    },
  });
};
