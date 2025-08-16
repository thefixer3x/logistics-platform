import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to log in', async ({ page }) => {
    await page.goto('/login');

    // Check that the login form is visible
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // This is a placeholder test. In a real scenario, you would fill in
    // the form and check for successful login. This requires a test user
    // and handling of the authentication flow.
    //
    // await page.getByLabel('Email').fill('test@example.com');
    // await page.getByLabel('Password').fill('password');
    // await page.getByRole('button', { name: 'Login' }).click();
    //
    // await expect(page).toHaveURL('/dashboard');
  });

  test('should show an error on failed login', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    // This is a placeholder for checking for an error message.
    // The exact selector will depend on the implementation.
    //
    // const errorMessage = page.getByTestId('login-error');
    // await expect(errorMessage).toBeVisible();
    // await expect(errorMessage).toHaveText('Invalid login credentials');
  });
});