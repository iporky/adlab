import test, { expect } from '@playwright/test';

test('App Data tests - Unautheticated flow', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'App Data' }).click();
  await expect(
    page.getByText('It seems like you are not logged in to access the information you are seeking.'),
  ).toBeDefined();
  await expect(page).toHaveScreenshot();
});

test('App Data tests - Autheticated flow', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'App Data' }).click();

  await expect(page.getByText('You have 3 active campaigns.')).toBeDefined();

  await expect(page.getByText('You have an active campaign budget of $9,000.00.')).toBeDefined();

  await expect(page).toHaveScreenshot();

  await expect(page.getByText('This page demonstrates the internationalization use-cases.')).toBeDefined();
});
