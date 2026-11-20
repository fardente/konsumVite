import React, { useEffect, useRef } from 'react';
import { IoAddOutline, IoCloseOutline } from 'react-icons/io5';
import { useAddItemMutation } from './Hooks/useAddItemMutation';
import { useSuggestionsQuery } from './Hooks/useFetchSuggestions';
import useModal from '../useModal';

export default function ShoppingListInputmodal() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: submitItem } = useAddItemMutation();

  const [currentInputValue, setCurrentInputValue] = React.useState('');
  const {
    data: suggestions,
    isLoading,
    isFetching,
    isError,
  } = useSuggestionsQuery(currentInputValue, true);
  const { toggleModal: toggleInputModal, RenderModal: InputModal } = useModal();

  const [areSuggestionsVisible, setAreSuggestionsVisible] =
    React.useState(false);

  function checkKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key == 'Enter') {
      event.preventDefault();
      submitItem(currentInputValue);
      setCurrentInputValue('');
      inputRef.current?.focus();
    }
  }
  if (isError) {
    console.error('Error fetching suggestions:', isError);
  }

  return (
    <div className="field">
      <div className="shopping-search-results has-background-dark">
        {suggestions &&
          suggestions.length > 0 &&
          suggestions.map((suggestion, index) => (
            <div key={index.toString()} className="shopping-search-result">
              <div
                onClick={event => {
                  event.preventDefault();
                  submitItem(suggestion);
                  setCurrentInputValue('');
                  inputRef.current?.focus();
                }}
                className="button is-light is-capitalized is-fullwidth"
              >
                {suggestion}
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
          ref={inputRef}
          autoFocus
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
            submitItem(currentInputValue);
            setCurrentInputValue('');
            inputRef.current?.focus();
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
