import { useQuery } from '@tanstack/react-query';
import { fetchShoppingItems } from '../../domain/firestoreApi';

export const useShoppingItemsQuery = () =>
  useQuery({
    queryKey: ['shoppingItems'],
    queryFn: fetchShoppingItems,
  });
