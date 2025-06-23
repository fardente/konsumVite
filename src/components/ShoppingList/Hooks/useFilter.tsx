import { ShoppingItem } from '../../../domain/shoppingItem';

export default function useFilter(
  setFilter: React.Dispatch<React.SetStateAction<string[]>>
) {
  function filterItemsByInput(itemsToFilter: ShoppingItem[], input: string) {
    return itemsToFilter.filter(
      item => item.name.toLowerCase().indexOf(input.toLowerCase()) != -1
    );
  }

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

  function filterItems(items: ShoppingItem[], input: string, tags: string[]) {
    input = input.toLowerCase().trim();
    return filterItemsByTag(filterItemsByInput(items, input), tags);
  }

  return [filterItems];
}
