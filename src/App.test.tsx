import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

function renderApp() {
  render(<App />, { wrapper: BrowserRouter });
}

describe('App', () => {
  it('renders shopping list', () => {
    renderApp();

    expect(screen.getByText('Shopping List')).toBeVisible();
    expect(screen.getByPlaceholderText('Add item...')).toBeVisible();
    expect(screen.getByRole('button', { name: /Filter/ }));
  });

  it('renders nav bar', () => {
    renderApp();

    expect(screen.getByText('Recipe Manager')).toBeVisible();
    // expect(screen.getByRole('navigation')).toBeVisible();
    expect(screen.getByRole('menu')).not.toBeVisible();
  });
});
