import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { fetchShoppingItems } from '../domain/api';
import ShoppingList from './ShoppingList';
export default function Shopping() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['shoppingItems'],
    queryFn: fetchShoppingItems,
  });

  if (isLoading || isError) return <div>Loading...</div>;

  return <ShoppingList shoppingList={data}></ShoppingList>;
}
