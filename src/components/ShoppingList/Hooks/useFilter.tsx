import { ShoppingItem } from '../../../domain/shoppingItem';

export default function useFilterByTags(
  setFilter: React.Dispatch<React.SetStateAction<string[]>>
) {
  function filterItemsByTag(itemsToFilter: ShoppingItem[], tags: string[]) {
    if (tags.length === 0) return itemsToFilter;

    const filteredItems = itemsToFilter.filter(
      item =>
        item
          .getTags()
          .map(i => i)
          .filter(it => tags.includes(it)).length > 0
    );

    if (filteredItems.length === 0) {
      setFilter([]);
      return itemsToFilter;
    } else {
      return filteredItems;
    }
  }

  function filterItems(items: ShoppingItem[], tags: string[]) {
    return filterItemsByTag(items, tags);
  }

  return [filterItems];
}
