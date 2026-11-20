import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page
    .getByRole('textbox', { name: 'User Name' })
    .fill('testuser@testmail.test');
  await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('textbox', { name: 'Password' }).fill('qwe');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('span')).toContainText('Login error!');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(
    page.getByRole('heading', { name: 'Shopping List' })
  ).toBeVisible();

  await page.getByRole('textbox', { name: 'Add item...' }).click();
  await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem1');
  await page.getByTestId('addShoppingItemButton').click();
  await page.getByRole('textbox', { name: 'Add item...' }).click();
  await page.getByRole('textbox', { name: 'Add item...' }).fill('testitem2');
  await page.getByRole('textbox', { name: 'Add item...' }).press('Enter');
  await page.locator('span').filter({ hasText: 'testitem1' }).click();
  await page.getByRole('textbox', { name: 'Add tag...' }).click();
  await page.getByRole('textbox', { name: 'Add tag...' }).fill('tag1');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Add tag...' }).click();
  await page.getByRole('textbox', { name: 'Add tag...' }).fill('tag2');
  await page.getByRole('textbox', { name: 'Add tag...' }).press('Enter');
  await page.getByText('edeka').nth(1).click();
  await page.getByText('biocompany').nth(1).click();
  await page
    .locator('.is-active > .modal-background')
    .first()
    .click({ position: { x: 50, y: 50 } });
  await expect(page.locator('section')).toContainText('tag1');
});
