import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IShoppingListItem } from '../../../domain/api';
import { addTagToShoppingItem } from '../../../domain/firestoreApi';

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
      const previousItems = queryClient.getQueryData<IShoppingListItem[]>([
        'shoppingItems',
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<IShoppingListItem[] | undefined>(
        ['shoppingItems'],
        oldItems => {
          if (!oldItems) return oldItems;

          return oldItems.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                tags: [...item.tags, tag.toLowerCase()], // Add the new tag optimistically
              };
            }
            return item;
          });
        }
      );

      // Return the previous state to rollback in case of an error
      return { previousItems };
    },
    onError: (err, variables, context) => {
      console.error(
        'Error adding tag:',
        'err',
        err,
        'vars',
        variables,
        'con',
        context
      );

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
