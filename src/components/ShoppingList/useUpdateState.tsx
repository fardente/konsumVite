import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addRecipe,
  updateRecipe,
  addIngredientsToShoppingList,
  IShoppingListItem,
} from '../../domain/api';
import {
  addShoppingItem,
  checkShoppingItem,
  deleteShoppingItem,
  addTagToShoppingItem,
  removeTagFromShoppingItem,
} from '../../domain/firestoreApi';

export default function useUpdateState() {
  const queryClient = useQueryClient();

  const addItemMutation = useMutation({
    mutationFn: (name: string) => addShoppingItem(name),
    onMutate: async (name: string) => {
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
                item => item.id.toLowerCase() != name.toLowerCase()
              ),
              {
                id: name,
                name,
                onList: true,
                checked: false,
                tags: [],
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
      queryClient.invalidateQueries(['shoppingItems']);
    },
  });

  const checkItemMutation = useMutation({
    mutationFn: ({ itemID, checked }: { itemID: string; checked: boolean }) =>
      checkShoppingItem(itemID, checked),
    onMutate: async ({
      itemID,
      checked,
    }: {
      itemID: string;
      checked: boolean;
    }) => {
      await queryClient.cancelQueries({ queryKey: ['shoppingItems'] });

      const prev: IShoppingListItem[] | undefined = queryClient.getQueryData([
        'shoppingItems',
      ]);

      queryClient.setQueryData<IShoppingListItem[] | undefined>(
        ['shoppingItems'],
        oldItems => {
          if (oldItems) {
            return oldItems.map(item => {
              if (item.id == itemID) {
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
      queryClient.invalidateQueries(['shoppingItems']);
    },
  });

  const deleteItemMutation = useMutation({
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

  const addTagToItemMutation = useMutation({
    mutationFn: ({ itemID, tag }: { itemID: string; tag: string }) =>
      addTagToShoppingItem(itemID, tag.toLowerCase()),
    onSuccess: () => {
      queryClient.invalidateQueries(['shoppingItems']);
    },
  });

  const removeTagFromItemMutation = useMutation({
    mutationFn: ({ itemId, tag }: { itemId: string; tag: string }) =>
      removeTagFromShoppingItem(itemId, tag),
    onSuccess: () => {
      queryClient.invalidateQueries(['shoppingItems']);
    },
  });

  const addRecipeMutation = useMutation({
    mutationFn: (recipe: EventTarget) => addRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes']);
    },
  });

  const updateRecipeMutation = useMutation({
    mutationFn: (recipe: EventTarget) => updateRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries(['updaterecipes']);
    },
  });

  const addIngredientsToShoppingListMutation = useMutation({
    mutationFn: (ingredients: EventTarget) =>
      addIngredientsToShoppingList(ingredients),
    onMutate: () => {
      queryClient.invalidateQueries();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  function submitItem(name: string) {
    return addItemMutation.mutate(name);
  }

  function checkItem(itemID: string, checked: boolean) {
    return checkItemMutation.mutate({ itemID, checked });
  }

  function deleteItem(itemID: string) {
    return deleteItemMutation.mutate(itemID);
  }

  function addTagToItem(itemID: string, tag: string) {
    return addTagToItemMutation.mutate({ itemID, tag });
  }

  function removeTagFromItem(itemId: string, tag: string) {
    return removeTagFromItemMutation.mutate({ itemId, tag });
  }

  function submitRecipe(recipe: EventTarget) {
    return addRecipeMutation.mutate(recipe);
  }

  function submitUpdateRecipe(recipe: EventTarget) {
    return updateRecipeMutation.mutate(recipe);
  }

  function putIngredientsOnShoppingList(ingredients: EventTarget) {
    return addIngredientsToShoppingListMutation.mutate(ingredients);
  }

  return {
    submitItem,
    checkItem,
    deleteItem,
    addTagToItem,
    removeTagFromItem,
    submitRecipe,
    submitUpdateRecipe,
    putIngredientsOnShoppingList,
  } as const;
}
