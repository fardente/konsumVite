import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { fetchShoppingItems, IShoppingListItem, TShoppingList } from './api';

export default function useShoppingListController(
  initialItems: TShoppingList = []
) {
  const [items, setItems] = React.useState<TShoppingList>(initialItems);
  console.log('Controller saiys items:', initialItems);

  function onAddShoppingItem(itemName: string) {
    const newItem: IShoppingListItem = {
      id: crypto.randomUUID(),
      name: itemName,
      checked: false,
      tags: [],
    };
    setItems(prev => [newItem, ...prev]);
    // await axios.post("additem", newItem)
  }

  // function onCheckShoppingItem();

  function onDeleteShoppingItem(itemId: string) {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }

  return { items, onAddShoppingItem, onDeleteShoppingItem };
}
