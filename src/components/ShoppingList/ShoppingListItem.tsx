import useModal from '../useModal';
import IonIcon from '@reacticons/ionicons';

import useUpdateState from './useUpdateState';
import { IShoppingListItem } from '../../domain/api';
import ShoppingItemDetailsModalView from './ShoppingItemDetailsModal';

export default function ShoppingListItem({
  item,
  availableTags,
}: {
  item: IShoppingListItem;
  availableTags: string[];
}) {
  const { toggleModal: toggleItemDetailsModal, RenderModal: ItemDetailsModal } =
    useModal();

  const { checkItem, deleteItem } = useUpdateState();

  const checked = item.checked;

  return (
    <div
      className={`columns is-mobile shopping-item-wrapper ${checked ? 'checked' : ''
        }`}
    >
      <div className="column is-flex-grow-0 shopping-item-button-div">
        <button
          className="button is-outlined is-danger is-light"
          onClick={() => deleteItem(item.id)}
        >
          {' '}
          <span className="icon is-small">
            <IonIcon name="trash-outline"></IonIcon>
          </span>
        </button>
      </div>
      <div className="column is-capitalized shopping-item-text">
        <span
          className="is-clickable is-underlined"
          onClick={toggleItemDetailsModal}
        >
          {item.name}
        </span>
        <div className="tags">
          {item.tags.map((tag: string, index: number) => {
            return (
              <span key={`${tag}${index}`} className="tag is-warning">
                {tag}
              </span>
            );
          })}
        </div>
      </div>
      <div className="column is-flex-grow-0 shopping-item-button-div">
        <button
          className={`button ${checked ? 'is-success' : 'is-outlined is-success is-light'
            }`}
          onClick={() => checkItem(item.id, !item.checked)}
        >
          <span className="icon is-small">
            {checked ? (
              <IonIcon name="checkmark-done-outline"></IonIcon>
            ) : (
              <IonIcon name="checkmark-outline"></IonIcon>
            )}
          </span>
        </button>
      </div>
      <ItemDetailsModal key={item.id}>
        <ShoppingItemDetailsModalView
          item={item}
          availableTags={availableTags}
        />
      </ItemDetailsModal>
    </div>
  );
}
