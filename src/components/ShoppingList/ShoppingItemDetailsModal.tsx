import React from 'react';
import IonIcon from '@reacticons/ionicons';
import { IShoppingListItem } from '../../domain/api';
import useUpdateState from './useUpdateState';

export default function ShoppingItemDetailsModalView({
  item,
  availableTags,
}: {
  item: IShoppingListItem;
  availableTags: string[];
}) {
  const [currentInputValue, setCurrentInputValue] = React.useState('');

  const { addTagToItem, removeTagFromItem } = useUpdateState();

  const fixedTags = [
    'baumarkt',
    'conny',
    'edeka',
    'biocompany',
    'dm',
    'budni',
    'rossmann',
  ];
  availableTags = availableTags
    .filter(tag => !fixedTags.includes(tag))
    .concat(fixedTags);
  const unusedTags = availableTags.filter(tag => !item.tags.includes(tag));

  function checkKey(event: React.KeyboardEvent) {
    if (event.key == 'Enter') {
      event.preventDefault();
      onAddTag(item.id, currentInputValue);
    }
  }

  function onAddTag(itemID: string, newTag: string) {
    console.log('SIDetailsModal: onAddTag ', itemID, newTag);
    addTagToItem(itemID, newTag);
    setCurrentInputValue('');
  }

  return (
    <>
      <h4 className="title is-4 is-capitalized">{item.name}</h4>
      <div className="tags are-large is-align-items-flex-start">
        {item.tags.length === 0 ? 'No Tags' : ''}
        {item.tags.map(tag => (
          <span key={`${tag}`} className="tag is-warning is-rounded">
            <>
              {tag}
              <button
                className="delete is-large"
                onClick={() => removeTagFromItem(item.id, tag)}
              ></button>
            </>
          </span>
        ))}
      </div>
      {unusedTags.length > 0 ? <hr /> : ''}
      {unusedTags.length > 0 ? (
        <>
          <h5 className="title is-5 is-underlined">Available Tags</h5>
        </>
      ) : (
        ''
      )}
      <div className="tags are-large is-align-items-flex-start">
        {unusedTags.map(tag => (
          <span
            key={`${tag}`}
            className="tag has-text-grey-light is-rounded"
            onClick={() => onAddTag(item.id, tag)}
          >
            {tag}{' '}
            <span className="icon is-large ml-0">
              <IonIcon name="add-circle" size="large"></IonIcon>
            </span>
          </span>
        ))}
      </div>
      {unusedTags.length > 0 ? <hr /> : ''}
      <div className="field has-addons has-addons-centered">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Add tag..."
            value={currentInputValue}
            onKeyDown={checkKey}
            onChange={event => setCurrentInputValue(event.target.value)}
            autoFocus
          />
        </div>
        <div className="control">
          <button
            className="button"
            onClick={() => onAddTag(item.id, currentInputValue)}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}
