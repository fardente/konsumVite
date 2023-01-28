import IonIcon from '@reacticons/ionicons';
import React, { useLayoutEffect } from 'react';
import useShoppingListController from '../domain/useShoppingListController';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { fetchShoppingItems, TShoppingList } from '../domain/api';

// eslint-disable-next-line react/prop-types
export default function ShoppingList({
  shoppingList,
}: {
  shoppingList: TShoppingList;
}) {
  const [currentInputValue, setCurrentInputValue] = React.useState('');

  const { items, onAddShoppingItem } = useShoppingListController(shoppingList);

  const tagsInUse = [
    ...new Set(
      items
        .map(item => item.tags)
        .flat()
        .map(tag => JSON.stringify(tag))
    ),
  ].map(item => JSON.parse(item));

  const uuid = crypto.randomUUID();
  // function onClearInput() {}
  console.log('items', items, uuid);
  return (
    <div>
      Headline FilterButton
      {/* <ShoppingInput /> */}
      {items.map(item => (
        <div key={item.id}>
          {item.name}
          {item.tags.map(tag => (
            <p key={tag.id}>{tag.tagName}</p>
          ))}
        </div>
      ))}
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
            // onKeyPress={checkKey}
            onChange={event => setCurrentInputValue(event.target.value)}
          ></input>
          <button
            onClick={() => onAddShoppingItem(currentInputValue)}
            data-testid="addShoppingItemButton"
            className="button is-medium is-success"
          >
            <span className="icon is-large">
              <IonIcon name="add-outline" className="is-large"></IonIcon>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
