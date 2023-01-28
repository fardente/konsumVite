import React from 'react';

function ShoppingListController() {
  const { data } = await axios.get("/api/shopping/items");
        setItemData(data);
        
  async function onAdd(inputValue) {
    if (inputValue == '') return;
    try {
      const { data } = await axios.post('/api/shopping/add', {
        newItem: inputValue,
      });
      if (data.error) {
        console.error(data.error);
      } else {
        setItemData([data, ...itemData]);
      }
    } catch (error) {
      console.error('onAdd error', error);
    }
    setCurrentInputValue('');
  }

  return <></>;
}
