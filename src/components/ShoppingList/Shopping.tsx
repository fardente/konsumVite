import React from 'react';
import { IShoppingListItem } from '../../domain/api';
import FilterView from './FilterView';
import useFilter from './useFilter';
import useModal from '../useModal';
import ShoppingListInputForm from './ShoppingListInputForm';
import ShoppingListItem from './ShoppingListItem';
import { useShoppingItemsQuery } from './useFetchItems';

export default function Shopping() {
  const { isLoading, isError, data } = useShoppingItemsQuery();

  const { toggleModal: toggleFilterModal, RenderModal: FilterModal } =
    useModal();

  const [filterTags, setFilterTags] = React.useState<string[]>([]);
  const [currentInputValue, setCurrentInputValue] = React.useState('');

  const [filterItems] = useFilter(setFilterTags);

  if (isError) return <div>Error!</div>;

  if (!data || isLoading) return <div>Loading...</div>;

  function getTagsInUse(items: IShoppingListItem[]): string[] {
    const allTags = items.reduce<string[]>(
      (accumulator, curr) => [
        ...accumulator,
        ...curr.tags.filter(tag => !accumulator.includes(tag)).map(tag => tag),
      ],
      []
    );
    return allTags;
  }

  const tagsInUse = getTagsInUse(data);
  const filtered = filterItems(data, currentInputValue, filterTags);
  filtered.sort((a, b) => Number(a.checked) - Number(b.checked));

  return (
    <div className="container has-text-centered shopping-container">
      <div className="is-relative">
        <h2 className="title">Shopping List</h2>

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
      </div>

      <div className="columns mt-0 is-centered shopping-items">
        <div className="column is-half">
          <div className="container shopping-items-container">
            {filtered.map(item => (
              <ShoppingListItem
                key={item.id}
                item={item}
                availableTags={tagsInUse}
              />
            ))}
          </div>
        </div>
      </div>

      <ShoppingListInputForm
        currentInputValue={currentInputValue}
        setCurrentInputValue={setCurrentInputValue}
      />
    </div>
  );
}
