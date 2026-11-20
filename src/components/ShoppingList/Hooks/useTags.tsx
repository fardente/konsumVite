import { useState } from 'react';
import { ShoppingItem } from '../../../domain/shoppingItem';
import { useShoppingItemsQuery } from './useFetchItems';

function filterItemsByTag(items: ShoppingItem[], tags: string[]) {
  if (tags.length === 0) return items;
  if (items.length === 0) return items;

  const filteredItems = items.filter(
    item =>
      item
        .getTags()
        .map(i => i)
        .filter(it => tags.includes(it)).length > 0
  );

  if (filteredItems.length === 0) {
    return undefined;
  } else {
    return filteredItems;
  }
  return filteredItems;
}

function getTagsInUse(items: ShoppingItem[]) {
  // const alltags =items.flatMap(item => item.getTags());
  // const uniqueTags = new Set(alltags.map(tag => tag.toLowerCase()));
  const allTags = items.reduce((accumulator, curr) => {
    const tags = curr.getTags().map(tag => tag.toLowerCase());
    return [...accumulator, ...tags.filter(tag => !accumulator.includes(tag))];
  }, [] as string[]);
  return allTags;
}

export default function useFilteredItems() {
  console.log('Fetching filtered items...');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const { isLoading, isError, data } = useShoppingItemsQuery();
  if (isError)
    return {
      filteredItems: [],
      tagsInUse: [],
      setFilterTags,
      filterTags,
      isLoading,
      isError,
    };

  if (!data || isLoading)
    return {
      filteredItems: [],
      tagsInUse: [],
      setFilterTags,
      filterTags,
      isLoading,
      isError,
    };

  const tagsInUse = getTagsInUse(data);
  const filtered = filterItemsByTag(data, filterTags);

  if (!filtered) {
    setFilterTags([]);
  } else {
    filtered.sort((a, b) => Number(a.checked) - Number(b.checked));
  }

  return {
    filteredItems: filtered,
    tagsInUse,
    setFilterTags,
    filterTags,
    isLoading,
    isError,
  };
}
