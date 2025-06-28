import React from 'react';
import { IoAddCircle } from 'react-icons/io5';
import { ShoppingItem } from '../../domain/shoppingItem';
import { useAddTagMutation } from './Hooks/useAddTagMutation';
import { useRemoveTagMutation } from './Hooks/useRemoveTagMutation';

export default function ShoppingItemDetailsModalView({
  item,
  availableTags,
}: {
  item: ShoppingItem;
  availableTags: string[];
}) {
  const [currentInputValue, setCurrentInputValue] = React.useState('');

  const { mutate: addTag } = useAddTagMutation();
  const { mutate: removeTag } = useRemoveTagMutation();

  const defaultTags = ['rewe', 'biocompany', 'rossmann', 'dm', 'baumarkt'];
  availableTags = Array.from(new Set([...availableTags, ...defaultTags]));
  const unusedTags = availableTags.filter(tag => !item.tags.includes(tag));

  function checkKey(event: React.KeyboardEvent) {
    if (event.key == 'Enter') {
      event.preventDefault();
      onAddTag(item.name, currentInputValue);
    }
  }

  function onAddTag(itemId: string, newTag: string) {
    addTag({ itemId, tag: newTag });
    setCurrentInputValue('');
  }

  function onRemoveTag(itemId: string, tag: string) {
    removeTag({ itemId, tag });
  }

  return (
    <>
      <h4 className="title is-4 is-capitalized">{item.name}</h4>
      <div className="tags are-large is-align-items-flex-start">
        {item.getTags().length === 0 ? 'No Tags' : ''}
        {item.tags.map(tag => (
          <span
            key={`${tag}`}
            className="tag is-warning is-rounded is-capitalized is-clickable"
            onClick={() => onRemoveTag(item.name, tag)}
          >
            <>
              {tag}
              <button className="delete is-large"></button>
            </>
          </span>
        ))}
      </div>
      {unusedTags.length > 0 ? <hr /> : ''}
      {unusedTags.length > 0 && (
        <>
          <h5 className="title is-5 is-underlined">Available Tags</h5>
        </>
      )}
      <div className="tags are-large is-align-items-flex-start">
        {unusedTags.map(tag => (
          <span
            key={`${tag}`}
            className="tag has-text-grey-light is-rounded is-capitalized is-clickable"
            onClick={() => onAddTag(item.name, tag)}
          >
            {tag}{' '}
            <span className="icon is-large ml-0">
              <IoAddCircle size={32}></IoAddCircle>
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
          />
        </div>
        <div className="control">
          <button
            className="button"
            onClick={() => onAddTag(item.name, currentInputValue)}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}
