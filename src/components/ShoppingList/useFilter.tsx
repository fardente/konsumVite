import { IShoppingListItem } from '../../domain/api';

export default function useFilter(
  setFilter: React.Dispatch<React.SetStateAction<string[]>>
) {
  function filterItemsByInput(
    itemsToFilter: IShoppingListItem[],
    input: string
  ) {
    return itemsToFilter.filter(
      item => item.name.toLowerCase().indexOf(input.toLowerCase()) != -1
    );
  }

  function filterItemsByTag(
    itemsToFilter: IShoppingListItem[],
    tags: string[]
  ) {
    if (tags.length === 0) return itemsToFilter;

    const filteredItems = itemsToFilter.filter(
      ({ tags: itemTags }) =>
        itemTags.map(i => i).filter(it => tags.includes(it)).length > 0
    );

    if (filteredItems.length === 0) {
      setFilter([]);
      return itemsToFilter;
    } else {
      return filteredItems;
    }
  }

  function filterItems(
    items: IShoppingListItem[],
    input: string,
    tags: string[]
  ) {
    input = input.toLowerCase().trim();
    return filterItemsByTag(filterItemsByInput(items, input), tags);
  }

  return [filterItems];
}
