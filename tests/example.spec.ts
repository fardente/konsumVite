import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('textbox', { name: 'User Name' }).type('qwe@qwe.qwe');
  await page.getByRole('textbox', { name: 'password' }).type('qwe123');
  await page.getByRole('button').click();
  // await page.waitForTimeout(100000);
  // Expects the URL to contain intro.
  const h2 = page.getByRole('heading', { name: 'Shopping List' });
  await expect(h2).toBeVisible();
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'User Name' }).fill('qwe@qwe.qwe');
  await page.getByRole('textbox', { name: 'Password' }).fill('qwe123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(
    page.getByRole('heading', { name: 'Shopping List' })
  ).toBeVisible();
});

test('test4', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).fill('qwe@qwe.qwe');
  await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('qwe');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('qwe123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'Shopping List' }).click();
  await expect(
    page.getByRole('heading', { name: 'Shopping List' })
  ).toBeVisible();
});
