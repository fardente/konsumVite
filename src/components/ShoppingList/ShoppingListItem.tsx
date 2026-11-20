import useModal from '../useModal';

import {
  IoCheckmarkDoneOutline,
  IoCheckmarkOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { ShoppingItem } from '../../domain/shoppingItem';
import { useCheckItemMutation } from './Hooks/useCheckItemMutation';
import { useDeleteItemMutation } from './Hooks/useDeleteItemMutation';
import ShoppingItemDetailsModalView from './ShoppingItemDetailsModal';

export default function ShoppingListItem({
  item,
  availableTags,
}: {
  item: ShoppingItem;
  availableTags: string[];
}) {
  const { toggleModal: toggleItemDetailsModal, RenderModal: ItemDetailsModal } =
    useModal();

  const { mutate: deleteItem } = useDeleteItemMutation();
  const { mutate: checkItem } = useCheckItemMutation();

  const checked = item.checked;

  return (
    <div
      data-testid={`shoppingListItem-${item.name}`}
      className={`columns is-mobile shopping-item-wrapper ${
        checked ? 'checked' : ''
      }`}
    >
      <div className="column is-flex-grow-0 shopping-item-button-div">
        <button
          className="button is-outlined is-danger is-light"
          onClick={() => deleteItem(item.name)}
          data-testid={`deleteShoppingItemButton-${item.name}`}
        >
          {' '}
          <span className="icon is-small">
            <IoTrashOutline />
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
          {item.getTags().map((tag: string, index: number) => {
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
          data-testid={`checkShoppingItemButton-${item.name}`}
          className={`button ${
            checked ? 'is-success' : 'is-outlined is-success is-light'
          }`}
          onClick={() =>
            checkItem({ itemId: item.name, checked: !item.checked })
          }
        >
          <span className="icon is-small">
            {checked ? <IoCheckmarkDoneOutline /> : <IoCheckmarkOutline />}
          </span>
        </button>
      </div>
      <ItemDetailsModal key={item.name}>
        <ShoppingItemDetailsModalView
          item={item}
          availableTags={availableTags}
        />
      </ItemDetailsModal>
    </div>
  );
}
