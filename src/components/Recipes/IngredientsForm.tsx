import IonIcon from '@reacticons/ionicons';
import React, { useState } from 'react';
import SuggestionBox from './SuggestionBox';

export default function UpdateIngredientsForm({
  ingredient_names,
}: {
  ingredient_names: string[];
}) {
  const [newIngredients, setNewIngredients] = React.useState(ingredient_names);
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState<null | number>(null);

  function onAddNewIngredient(event: React.FormEvent) {
    event.preventDefault();
    setNewIngredients(prev => [...prev, '']);
  }

  function onRemoveIngredient(
    event: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) {
    event.preventDefault();
    setNewIngredients(prev => prev.filter((_, i) => i !== index));
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    setInput(event.target.value);
    setNewIngredients(prev => {
      const updatedIngredients = [...prev];
      updatedIngredients[index] = event.target.value;
      return updatedIngredients;
    });
    setCurrentIndex(index);
  }

  function onAcceptSuggestion(suggestion: string) {
    setInput(suggestion);
    setNewIngredients(prev => {
      const updatedIngredients = [...prev];
      updatedIngredients[currentIndex!] = suggestion;
      return updatedIngredients;
    });
    setCurrentIndex(null);
  }

  return (
    <div className="field">
      {newIngredients.map((ingredientName: string, index: number) => (
        <div className="field has-addons" key={index.toString()}>
          <div className="control">
            <input
              autoComplete="off"
              className="input"
              value={ingredientName}
              type="text"
              placeholder="New ingredient..."
              name="ingredient"
              onChange={event => onChange(event, index)}
              // onBlur={event => {
              //   setInput('');
              //   setCurrentIndex(null);
              // }}
              // onFocus={event => {
              //   setInput(ingredientName);
              //   setCurrentIndex(index);
              // }}
            ></input>
            {currentIndex === index && (
              <SuggestionBox
                input={input}
                onAcceptSuggestion={onAcceptSuggestion}
              />
            )}
          </div>
          <div className="control">
            <a
              onClick={event => onRemoveIngredient(event, index)}
              className="button is-danger is-light"
            >
              <span className="icon is-small is-left">
                <IonIcon name="close-outline"></IonIcon>
              </span>
            </a>
          </div>
        </div>
      ))}
      <div className="control">
        <button
          className="button is-success is-light is-outlined"
          name="addIngredientBtn"
          onClick={event => onAddNewIngredient(event)}
        >
          Add Ingredient
        </button>
      </div>
    </div>
  );
}
