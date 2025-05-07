import IonIcon from '@reacticons/ionicons';
import React from 'react';
import useUpdateState from '../Recipes/Hooks/useAddRecipeMutation';
import { useAddItemMutation } from './Hooks/useAddItemMutation';

export default function ShoppingListInputForm({
  currentInputValue,
  setCurrentInputValue,
}: {
  currentInputValue: string;
  setCurrentInputValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { mutate: submitItem } = useAddItemMutation();

  function checkKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key == 'Enter') {
      event.preventDefault();
      submitItem({ name: currentInputValue, tags: [] });
      setCurrentInputValue('');
    }
  }

  return (
    <div className="inputBoxRow field">
      <div className="shopping-search-results has-background-dark">
        {/* {showSuggestions ? renderSuggestions() : ''} */}
      </div>
      <div className="inputGroup control">
        <button
          onClick={() => setCurrentInputValue('')}
          data-testid="clearInputButton"
          className="button is-medium"
        >
          <span className="icon is-large">
            <IonIcon name="close-outline" className="is-large"></IonIcon>
          </span>
        </button>
        <input
          className="input is-medium"
          type="text"
          placeholder="Add item..."
          value={currentInputValue}
          onKeyDown={checkKey}
          onChange={event => setCurrentInputValue(event.target.value)}
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
            <IonIcon name="add-outline" className="is-large"></IonIcon>
          </span>
        </button>
      </div>
    </div>
  );
}
