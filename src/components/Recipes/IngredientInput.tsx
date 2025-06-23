import { IoCloseOutline } from 'react-icons/io5';
import React, { useState } from 'react';
import { useSuggestionsQuery } from '../ShoppingList/Hooks/useFetchSuggestions';

export default function IngredientInput({
  ingredient_names,
}: {
  ingredient_names: string[];
}) {
  const [newIngredients, setNewIngredients] = React.useState(ingredient_names);
  const [input, setInput] = useState('');
  const { data: suggestions, isLoading } = useSuggestionsQuery(input);

  function onAdd(event: React.FormEvent) {
    event.preventDefault();
    setNewIngredients(prev => [...prev, '']);
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    setInput(event.target.value);
    setNewIngredients(prev => {
      const updatedIngredients = [...prev];
      updatedIngredients[index] = event.target.value;
      return updatedIngredients;
    });
  }

  function onRemove(event: React.MouseEvent<HTMLAnchorElement>, index: number) {
    event.preventDefault();
    setNewIngredients(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="field">
      asdas
      {newIngredients.map((ingredientName: string, index: number) => (
        <div className="field has-addons" key={index.toString()}>
          <div className="control">
            <input
              className="input"
              value={ingredientName}
              type="text"
              placeholder="New ingredients..."
              name="ingredient"
              onChange={event => onChange(event, index)}
            ></input>
            {ingredientName == input &&
              suggestions &&
              suggestions.length > 0 &&
              suggestions.map((item, index) => (
                <div key={index.toString()} className="shopping-search-result">
                  <div
                    // onClick={() => onAdd(item.item_name)}
                    className="button is-light"
                  >
                    {item}
                    {/* <span className="icon is-small">
                            {checkExists(item.item_name) ? (
                                <ion-icon name="checkmark-done-outline"></ion-icon>
                            ) : (
                                <ion-icon name="checkmark-outline"></ion-icon>
                            )}
                        </span> */}
                  </div>
                </div>
              ))}
          </div>
          <div className="control">
            <a
              onClick={event => onRemove(event, index)}
              className="button is-danger is-light"
            >
              <span className="icon is-small is-left">
                <IoCloseOutline />
              </span>
            </a>
          </div>
        </div>
      ))}
      <div className="control">
        <button
          className="button is-success is-light is-outlined"
          name="addIngredientBtn"
          onClick={event => onAdd(event)}
        >
          Add Ingredient
        </button>
      </div>
    </div>
  );
}
