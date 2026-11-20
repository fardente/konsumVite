import FilterView from './FilterView';
import useFilteredItems from './Hooks/useTags';
import ShoppingListItem from './ShoppingListItem';

export default function ShoppingList({
  showFilterModal,
  toggleModal,
}: {
  showFilterModal: boolean;
  toggleModal: () => void;
}) {
  console.log('ShoppingList rendered');

  const {
    isLoading,
    isError,
    filteredItems: data,
    filterTags,
    setFilterTags,
    tagsInUse,
  } = useFilteredItems();
  if (isError) return <div>Error!</div>;

  if (!data || isLoading) return <div>Loading...</div>;

  return (
    <div className="columns mt-0 is-centered shopping-items">
      <div className="column is-half">
        <div className="container shopping-items-container">
          {data.map(item => (
            <ShoppingListItem
              key={item.name}
              item={item}
              availableTags={tagsInUse}
            />
          ))}
        </div>
      </div>

      <div className={`modal ${showFilterModal ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={toggleModal}></div>
        <div className="modal-content mb-6">
          <div className="container m-3">
            <div className="box">
              <FilterView
                toggleModal={toggleModal}
                filterTags={filterTags}
                setFilterTags={setFilterTags}
                tagsInUse={tagsInUse}
              />
            </div>
          </div>
        </div>
        <button
          className="modal-close is-large"
          onClick={toggleModal}
          aria-label="close"
        ></button>
      </div>
    </div>
  );
}
