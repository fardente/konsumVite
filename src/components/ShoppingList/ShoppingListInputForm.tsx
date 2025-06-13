import React from 'react';
import { useAddItemMutation } from './Hooks/useAddItemMutation';
import { useSuggestionsQuery } from './Hooks/useFetchSuggestions';
import { IoAddOutline, IoCloseOutline } from 'react-icons/io5';

export default function ShoppingListInputForm({
  currentInputValue,
  setCurrentInputValue,
}: {
  currentInputValue: string;
  setCurrentInputValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { mutate: submitItem } = useAddItemMutation();

  const {
    data: suggestions,
    isLoading,
    isFetching,
    isError,
  } = useSuggestionsQuery(currentInputValue, true);

  function checkKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key == 'Enter') {
      event.preventDefault();
      submitItem({ name: currentInputValue, tags: [] });
      setCurrentInputValue('');
    }
  }
  if (isError) {
    console.error('Error fetching suggestions:', isError);
  }

  return (
    <div className="inputBoxRow field">
      <div className="shopping-search-results has-background-dark">
        {suggestions &&
          suggestions.length > 0 &&
          suggestions.map((suggestion, index) => (
            <div key={index.toString()} className="shopping-search-result">
              <div
                onClick={event => {
                  event.preventDefault();
                  submitItem({ name: suggestion.name, tags: [] });
                  setCurrentInputValue('');
                }}
                className="button is-light"
              >
                {suggestion.name}
              </div>
            </div>
          ))}
      </div>
      <div className="inputGroup control">
        <button
          onClick={() => setCurrentInputValue('')}
          data-testid="clearInputButton"
          className="button is-medium"
        >
          <span className="icon is-large">
            <IoCloseOutline className="is-large" />
          </span>
        </button>
        <input
          className="input is-medium"
          type="text"
          placeholder="Add item..."
          value={currentInputValue}
          onKeyDown={checkKey}
          onChange={event => setCurrentInputValue(event.target.value)}
          autoComplete="off"
        ></input>
        <button
          onClick={() => {
            submitItem({ name: currentInputValue, tags: [] });
            setCurrentInputValue('');
          }}
          data-testid="addShoppingItemButton"
          className="button is-medium is-success"
        >
          <span className="icon is-large">
            <IoAddOutline className="is-large" />
          </span>
        </button>
      </div>
    </div>
  );
}
