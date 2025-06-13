import React, { useState } from 'react';
import { useShoppingItemsQuery } from '../ShoppingList/Hooks/useFetchItems';
import Checkbox from './Checkbox';
import UpdateIngredientsForm from './IngredientsForm';
import { useAddIngredientsToShoppingListMutation } from './Hooks/useAddIngredientsToShoppingListMutation';
import { IoCheckmarkOutline } from 'react-icons/io5';

export default function IngredientsList({
  ingredients,
  recipeName,
  editMode,
}: {
  ingredients: string[];
  recipeName: string;
  editMode: boolean;
}) {
  const { isLoading, isError, data } = useShoppingItemsQuery();
  const { mutate: putIngredientsOnShoppingList, isSuccess } =
    useAddIngredientsToShoppingListMutation();

  if (isError) return <div>Error!</div>;

  if (!data || isLoading) return <div>Loading...</div>;

  const currentListItems = data.map(item => item.name);

  function isItemOnList(item: string, list: string[]) {
    return list.includes(item);
  }

  async function onSubmitIngredientsToShoppingList(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ingredients = formData
      .values()
      .toArray()
      .filter(
        (value): value is string =>
          typeof value === 'string' && value.length > 0
      );
    putIngredientsOnShoppingList({ ingredients, recipeName });
  }

  return (
    <div className="box">
      <div className="container has-text-centered  ">
        <h2 className="subtitle has-text-weight-semibold has-text-centered"></h2>
        {editMode ? (
          <UpdateIngredientsForm ingredient_names={ingredients} />
        ) : (
          <form
            action="/"
            method="POST"
            onSubmit={event => onSubmitIngredientsToShoppingList(event)}
          >
            <ul className="ingredients has-background-light">
              {ingredients.map((ingredient, index) => (
                <li key={index.toString()}>
                  <div className="field is-grouped has-text-left">
                    <Checkbox
                      key={`${isItemOnList(
                        ingredient,
                        currentListItems
                      )}${ingredient}`}
                      initial={!isItemOnList(ingredient, currentListItems)}
                      value={ingredient}
                      name={
                        isItemOnList(ingredient, currentListItems)
                          ? `${ingredient} (already on list)`
                          : `${ingredient}`
                      }
                      disabled={isItemOnList(ingredient, currentListItems)}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="field mt-3">
              <div className="control">
                <button className="button is-success" type="submit">
                  <span>Add to shopping list</span>

                  {isSuccess ? (
                    <span className="icon is-small">
                      <IoCheckmarkOutline />
                    </span>
                  ) : (
                    ''
                  )}
                </button>
              </div>
            </div>
          </form>
        )}{' '}
      </div>
    </div>
  );
}
