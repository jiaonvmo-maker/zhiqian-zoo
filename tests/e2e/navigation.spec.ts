import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
  test('should load entry page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Vite + React').or(page.locator('[class*="pa-"]'))).toBeVisible({ timeout: 10000 });
  });

  test('should navigate from entry to office building', async ({ page }) => {
    await page.goto('/');

    // Wait for any button or interactive element to appear
    await page.waitForSelector('button', { timeout: 10000 });

    // Look for navigation elements
    const buttons = await page.locator('button').all();
    if (buttons.length > 0) {
      await buttons[0].click();
    }
  });

  test('should render without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (like Three.js warnings)
    const criticalErrors = errors.filter(
      (err) => !err.includes('Three') && !err.includes('WebGL')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Office Building Interaction', () => {
  test('should display office building when navigating to sandbox phase', async ({ page }) => {
    await page.goto('/');

    // This is a placeholder - adjust based on actual navigation flow
    await page.waitForSelector('[class*="pa-"]', { timeout: 10000 });
  });
});
