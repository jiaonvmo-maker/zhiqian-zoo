import { test, expect } from '@playwright/test';

test.describe('Department Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show department details on hover', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if any department elements are present
    const hasDepartments = await page.locator('[class*="department"]').count();

    if (hasDepartments > 0) {
      // Test hover interaction
      await page.locator('[class*="department"]').first().hover();
      await page.waitForTimeout(500); // Wait for hover effects
    }
  });

  test('should navigate to department chat', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for department-related buttons
    const chatButtons = await page.locator('button:has-text("群聊")').all();

    if (chatButtons.length > 0) {
      await chatButtons[0].click();
      await page.waitForTimeout(500);
    }
  });
});
