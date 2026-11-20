import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  fetchShoppingItems,
  subscribeShoppingItems,
} from '../../../domain/firestoreApi';

export const useShoppingItemsQuery = () => {
  const queryClient = useQueryClient();

  // Push Firestore snapshots (cache first, then server/live updates) straight
  // into the query cache, so the list renders before the network answers.
  useEffect(
    () =>
      subscribeShoppingItems(items =>
        queryClient.setQueryData(['shoppingItems'], items)
      ),
    [queryClient]
  );

  return useQuery({
    queryKey: ['shoppingItems'],
    queryFn: fetchShoppingItems,
  });
};
