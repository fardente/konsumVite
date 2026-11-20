import { test as base, expect, Page } from '@playwright/test';
import path from 'path';

type TestFixtures = {
  loggedInNewRecipePage: Page;
};

export const test = base.extend<TestFixtures>({
  loggedInNewRecipePage: async ({ page }, use) => {
    await page.goto('/');
    await page
      .getByRole('textbox', { name: 'User Name' })
      .fill('testuser@testmail.test');
    await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(
      page.getByRole('heading', { name: 'Shopping List' })
    ).toBeVisible();
    await page.goto('/recipes/add');
    await use(page);
  },
});

// test('Recipe link', async ({ loggedInPage: page }) => {
//   await page.getByText('Recipes').click();
//   await expect(
//     page.getByRole('heading', { name: 'Recipe List' })
//   ).toBeVisible();
// });

test('Add Recipe', async ({ loggedInNewRecipePage: page }) => {
  await expect(
    page.getByRole('heading', { name: 'Add a Recipe' })
  ).toBeVisible();
  const input = page.getByRole('textbox', { name: 'Recipe Name' });
  await input.fill('testRecipe');
  await page.getByTestId('ingredientInput0').fill('testIngredient');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByTestId('ingredientInput1').fill('testIngredient2');
  await page
    .getByRole('textbox', { name: 'Add preparation steps here...' })
    .fill('testPreparation');
  // const filePath = path.resolve(__dirname, 'chili.jpg');
  await page.setInputFiles('input[type="file"]', 'tests/chili.jpg');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(
    page.getByRole('heading', { name: 'Recipe List' })
  ).toBeVisible();
  await expect(page.getByText('testRecipe')).toBeVisible();
});
