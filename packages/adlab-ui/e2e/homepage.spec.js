import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TFS UI Boilerplate | 247.ai/);
});

test('login logout state transition ', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  // Expects page to have a 'offline' text at launch.
  await expect(page.locator('#root')).toContainText('offline');

  await expect(page.locator('#root')).toContainText('Your Homepage');

  await expect(page.getByRole('link', { name: 'Home' })).toContainText('Home');
  await expect(page.getByRole('link', { name: 'App Data' })).toContainText('App Data');
  await expect(page.getByRole('link', { name: 'Demos' })).toContainText('Demos');

  await expect(page.locator('#root')).toContainText(/This page demonstrates the typography component use-cases./);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('#root')).toContainText('online');
  await expect(page.getByText('John Doe')).toBeDefined();
  await expect(page.getByText('john.doe@fake-email.com')).toBeDefined();
  await expect(page.getByText('Fake Org Inc.')).toBeDefined();
  await expect(page.getByText('Logged in as Admin')).toBeDefined();

  await expect(page).toHaveScreenshot();

  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page.locator('#root')).toContainText('offline');
});

test('locale switching', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('combobox').selectOption('es');

  await expect(page.locator('#root')).toContainText('Tu Pagina De Inicio');

  await expect(page.getByRole('link', { name: 'Casa' })).toContainText('Casa');
  await expect(page.getByRole('link', { name: 'Datos De La Aplicacion' })).toContainText('Datos De La Aplicacion');
  await expect(page.getByRole('link', { name: 'Demos' })).toContainText('Demos');

  await expect(page.locator('#root')).toContainText(
    /Esta página demuestra los casos de uso del componente de tipografía./,
  );
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page.locator('#root')).toContainText('en línea');

  await expect(page).toHaveScreenshot();

  await page.getByRole('button', { name: 'Cerrar sesión' }).click();

  await expect(page.locator('#root')).toContainText('desconectado');
});
