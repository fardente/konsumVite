import { test, expect } from '@playwright/test';

test('Failed login shows error', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('textbox', { name: 'User Name' })
    .fill('testuser@testmail.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('qwe');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('span')).toContainText('Login error!');
});

test('Successful login shows shopping list', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page
    .getByRole('textbox', { name: 'User Name' })
    .fill('testuser@testmail.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(
    page.getByRole('heading', { name: 'Shopping List' })
  ).toBeVisible();
});

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Konsum/);
});
