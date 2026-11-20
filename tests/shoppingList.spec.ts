import { test as base, expect, Page } from '@playwright/test';
import { deleteDatabase } from './firebaseSetupHelpers';
type TestFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<TestFixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/');
    await page
      .getByRole('textbox', { name: 'User Name' })
      .fill('testuser@testmail.test');
    await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(
      page.getByRole('heading', { name: 'Shopping List' })
    ).toBeVisible();
    await use(page);
  },
});

test.beforeEach(async ({ page }) => {
  console.log('Running before each test');
  await deleteDatabase();
});

test('has title', async ({ loggedInPage: page }) => {
  await expect(page).toHaveTitle(/Konsum/);
});

test.describe('Shopping List Input', () => {
  test('Adding an item', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: 'Add item' }).click();
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await page.locator('button.modal-close').filter({ visible: true }).click();

    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).toBeVisible();
  });

  test('Clear input button clears shopping input', async ({
    loggedInPage: page,
  }) => {
    await page.getByRole('button', { name: 'Add item' }).click();
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('clearInputButton').click();

    await expect(
      page.getByRole('textbox', { name: 'Add item...' })
    ).toHaveValue('');
  });

  test.skip('Starting to enter an item filters the shopping list', async ({
    loggedInPage: page,
  }) => {
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).toBeVisible();

    await page.getByRole('textbox', { name: 'Add item...' }).fill('otheritem');
    await page.getByTestId('addShoppingItemButton').click();
    await expect(
      page.locator('span').filter({ hasText: 'otheritem' })
    ).toBeVisible();

    const input = page.getByRole('textbox', { name: 'Add item...' });
    await input.fill('t');
    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).toBeVisible();
    await expect(
      page.locator('span').filter({ hasText: 'otheritem' })
    ).toBeVisible();

    await input.fill('test');
    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).toBeVisible();
    await expect(
      page.locator('span').filter({ hasText: 'otheritem' })
    ).not.toBeVisible();
  });
});

test.describe.skip('Suggestions', () => {
  test('Starting to enter an item shows the suggestions', async ({
    loggedInPage: page,
  }) => {
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).toBeVisible();

    await page.getByRole('textbox', { name: 'Add item...' }).fill('otheritem');
    await page.getByTestId('addShoppingItemButton').click();
    await expect(
      page.locator('span').filter({ hasText: 'otheritem' })
    ).toBeVisible();

    await page.getByTestId('deleteShoppingItemButton-otheritem').click();
    await expect(
      page.locator('span').filter({ hasText: 'otheritem' })
    ).not.toBeVisible();

    await page.getByRole('textbox', { name: 'Add item...' }).fill('o');

    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).not.toBeVisible();
    await expect(
      page.locator('div.button').filter({ hasText: 'otheritem' })
    ).toBeVisible();
  });

  test('Clicking a suggestions adds it to the shopping list', async ({
    loggedInPage: page,
  }) => {
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).toBeVisible();

    await page.getByRole('textbox', { name: 'Add item...' }).fill('otheritem');
    await page.getByTestId('addShoppingItemButton').click();
    await expect(
      page.locator('span').filter({ hasText: 'otheritem' })
    ).toBeVisible();

    await page.getByTestId('deleteShoppingItemButton-otheritem').click();
    await expect(
      page.locator('span').filter({ hasText: 'otheritem' })
    ).not.toBeVisible();

    await page.getByRole('textbox', { name: 'Add item...' }).fill('o');
    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).not.toBeVisible();
    await expect(
      page.locator('div.button').filter({ hasText: 'otheritem' })
    ).toBeVisible();

    await page.locator('div.button').filter({ hasText: 'otheritem' }).click();
    await expect(
      page.locator('span').filter({ hasText: 'otheritem' })
    ).toBeVisible();
  });
});

test.describe('Shopping List Items', () => {
  test('[TC1] Check a shopping item', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: 'Add item' }).click();
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).toBeVisible();
    const button = page.getByTestId('checkShoppingItemButton-testitem');
    await button.click();
    await expect(button).not.toHaveClass(/is-outlined/);
  });

  test('[TC2] Deleting a shopping item', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: 'Add item' }).click();
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).toBeVisible();
    await page.getByTestId('deleteShoppingItemButton-testitem').click();
    await expect(
      page.locator('span').filter({ hasText: 'testitem' })
    ).not.toBeVisible();
  });
});

test.describe('Shopping List Tags', () => {
  test('[Tag1] Adding a new tag', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: 'Add item' }).click();
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await page.locator('span').filter({ hasText: 'testitem' }).click();
    await page.getByRole('textbox', { name: 'Add tag...' }).fill('testtag');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(
      page
        .getByTestId('shoppingListItem-testitem')
        .locator('span.is-capitalized')
        .filter({ hasText: 'Testtag', visible: true })
    ).toBeVisible();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await expect(
      page
        .getByTestId('shoppingListItem-testitem')
        .locator('span')
        .filter({ hasText: 'Testtag', visible: true })
    ).toBeVisible();
  });

  test('[TAG2] Remove a new tag', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: 'Add item' }).click();
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await page.locator('span').filter({ hasText: 'testitem' }).click();
    await page.getByRole('textbox', { name: 'Add tag...' }).fill('testtag');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await page.locator('span').filter({ hasText: 'testitem' }).click();
    await page
      .getByTestId('shoppingListItem-testitem')
      .locator('span.is-capitalized')
      .filter({ hasText: 'Testtag', visible: true })
      .click();
    await expect(
      page
        .getByTestId('shoppingListItem-testitem')
        .locator('span.is-capitalized')
        .filter({ hasText: 'Testtag', visible: true })
    ).not.toBeVisible();
  });

  test('Adding an existing tag', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: 'Add item' }).click();
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await page.locator('span').filter({ hasText: 'testitem' }).click();
    await page
      .getByTestId('shoppingListItem-testitem')
      .locator('span.is-capitalized')
      .filter({ hasText: 'Rossmann', visible: true })
      .click();
    await expect(
      page
        .getByTestId('shoppingListItem-testitem')
        .locator('span.is-warning.is-capitalized')
        .filter({ hasText: 'Rossmann', visible: true })
    ).toBeVisible();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await expect(
      page
        .getByTestId('shoppingListItem-testitem')
        .locator('span')
        .filter({ hasText: 'Rossmann', visible: true })
    ).toBeVisible();
  });

  test('Remove an existing tag', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: 'Add item' }).click();
    await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem');
    await page.getByTestId('addShoppingItemButton').click();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await page.locator('span').filter({ hasText: 'testitem' }).click();
    await page
      .getByTestId('shoppingListItem-testitem')
      .locator('span.is-capitalized')
      .filter({ hasText: 'Rossmann', visible: true })
      .click();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await page.locator('span').filter({ hasText: 'testitem' }).click();

    await page
      .getByTestId('shoppingListItem-testitem')
      .locator('span.is-warning.is-capitalized')
      .filter({ hasText: 'Rossmann', visible: true })
      .click();
    await expect(
      page
        .getByTestId('shoppingListItem-testitem')
        .locator('span.is-warning.is-capitalized')
        .filter({ hasText: 'Rossmann', visible: true })
    ).not.toBeVisible();
    await page.locator('button.modal-close').filter({ visible: true }).click();
    await expect(
      page
        .getByTestId('shoppingListItem-testitem')
        .locator('span.is-capitalized')
        .filter({ hasText: 'Rossmann', visible: true })
    ).not.toBeVisible();
  });
});

test.skip('Filter shopping list by tags', async ({ loggedInPage: page }) => {
  await page.goto('/');
  await page
    .getByRole('textbox', { name: 'User Name' })
    .fill('testuser@testmail.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('qwe');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('span')).toContainText('Login error!');
});

test.skip('Clear tag filter', async ({ loggedInPage: page }) => {
  await page.goto('/');
  await page
    .getByRole('textbox', { name: 'User Name' })
    .fill('testuser@testmail.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('qwe');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('span')).toContainText('Login error!');
});
