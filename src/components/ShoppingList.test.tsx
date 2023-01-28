import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ShoppingList from './ShoppingList';

describe('ShoppingList', () => {
  it('renders shopping list', () => {
    render(<ShoppingList />);

    expect(screen.getByText('Shopping List')).toBeVisible();
    expect(screen.getByPlaceholderText('Add item...')).toBeVisible();
    expect(screen.getByRole('button', { name: /Filter/ }));
  });

  it('Clearing input field', async () => {
    const user = userEvent.setup();
    render(<ShoppingList />);

    const inputField = screen.getByRole('textbox');
    expect(inputField).toHaveValue('');
    await user.type(inputField, 'testText');
    expect(inputField).toHaveValue('testText');

    const clearButton = screen.getByTestId('clearInputButton');
    await user.click(clearButton);
    expect(inputField).toHaveValue('');

    expect(inputField).toHaveValue('');
    await user.type(inputField, 'testText2');
    expect(inputField).toHaveValue('testText2');

    await user.click(clearButton);
    expect(inputField).toHaveValue('');
  });
});
