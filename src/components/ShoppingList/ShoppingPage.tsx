import { useState } from 'react';
import ShoppingList from './ShoppingList';
import ShoppingListInputForm from './ShoppingListInputForm';

export default function ShoppingPage() {
  const [showFilterModal, setFilterModal] = useState(false);

  function toggleModal() {
    setFilterModal(showing => !showing);
  }

  return (
    <div className="container has-text-centered shopping-container">
      <ShoppingList
        showFilterModal={showFilterModal}
        toggleModal={toggleModal}
      />
      <div className="is-flex is-justify-content-center m-4">
        <button className="button btnFilter m-4" onClick={toggleModal}>
          Filter
        </button>
        <ShoppingListInputForm />
      </div>
    </div>
  );
}
