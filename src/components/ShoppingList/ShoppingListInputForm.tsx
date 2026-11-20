import useModal from '../useModal';
import ShoppingListInputmodal from './ShoppingListInputModal';

export default function ShoppingListInputForm() {
  const { toggleModal: toggleInputModal, RenderModal: InputModal } = useModal();

  return (
    <div className="">
      <button className="button btnFilter m-4" onClick={toggleInputModal}>
        Add Item
      </button>
      <InputModal>
        <ShoppingListInputmodal />
      </InputModal>
    </div>
  );
}
