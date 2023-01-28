import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import useShoppingListController from './useShoppingListController';

function DummyComponent() {
  const initItems = [{ id: '2', name: 'hans', checked: false }];
  const { items, onAddShoppingItem, onDeleteShoppingItem } =
    useShoppingListController(initItems);

  return (
    <div>
      <h1>moin</h1>
      <button
        onClick={() => onAddShoppingItem('TestItem1')}
        data-testid="addButton"
      >
        Additem
      </button>
      <div>
        items: {items[0] ? 'moin' : 'no'}{' '}
        {items.map(i => (
          <h1 key={i.id}>{i.name}</h1>
        ))}
      </div>
    </div>
  );
}

describe('ShoppingListControlelr', () => {
  it('Adding items', async () => {
    const user = userEvent.setup();
    render(<DummyComponent />);
    expect(screen.queryByText('TestItem1')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('addButton'));
    expect(await screen.findByText('TestItem1')).toBeVisible();
  });
});
