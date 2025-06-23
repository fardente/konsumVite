import React from 'react';
import { ShoppingItem } from '../../domain/shoppingItem';
import useModal from '../useModal';
import FilterView from './FilterView';
import { useShoppingItemsQuery } from './Hooks/useFetchItems';
import useFilter from './Hooks/useFilter';
import ShoppingListInputForm from './ShoppingListInputForm';
import ShoppingListItem from './ShoppingListItem';

export default function Shopping() {
  const { isLoading, isError, data } = useShoppingItemsQuery();

  const { toggleModal: toggleFilterModal, RenderModal: FilterModal } =
    useModal();

  const [filterTags, setFilterTags] = React.useState<string[]>([]);
  const [currentInputValue, setCurrentInputValue] = React.useState('');

  const [filterItems] = useFilter(setFilterTags);

  if (isError) return <div>Error!</div>;

  if (!data || isLoading) return <div>Loading...</div>;

  function getTagsInUse(items: ShoppingItem[]) {
    // const alltags =items.flatMap(item => item.getTags());
    // const uniqueTags = new Set(alltags.map(tag => tag.toLowerCase()));
    const allTags = items.reduce((accumulator, curr) => {
      const tags = curr.getTags().map(tag => tag.toLowerCase());
      return [
        ...accumulator,
        ...tags.filter(tag => !accumulator.includes(tag)),
      ];
    }, [] as string[]);
    return allTags;
  }

  const tagsInUse = getTagsInUse(data);
  const filtered = filterItems(data, currentInputValue, filterTags);
  filtered.sort((a, b) => Number(a.checked) - Number(b.checked));

  return (
    <div className="container has-text-centered shopping-container">
      <div className="columns mt-0 is-centered shopping-items">
        <div className="column is-half">
          <div className="container shopping-items-container">
            {filtered.map(item => (
              <ShoppingListItem
                key={item.name}
                item={item}
                availableTags={tagsInUse}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex mb-4">
        di
        <FilterModal>
          <FilterView
            setFilter={setFilterTags}
            filter={filterTags}
            toggleModal={toggleFilterModal}
            tagsInUse={tagsInUse}
          />
        </FilterModal>
        <button className="button btnFilter" onClick={toggleFilterModal}>
          Filter
        </button>
        <ShoppingListInputForm
          currentInputValue={currentInputValue}
          setCurrentInputValue={setCurrentInputValue}
        />
      </div>
    </div>
  );
}
