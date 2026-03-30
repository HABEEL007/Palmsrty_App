import { test, expect } from '@playwright/test';

test.describe('Palm Reading E2E Flows', () => {
  
  test('Guest User Flow: From scan to reading', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/');
    await expect(page).toHaveTitle(/PALMSTRY/);

    // 2. Click Scan Palm Now
    await page.click('text=Scan Palm Now');
    await expect(page).toHaveURL(/\/scan/);

    // 3. Simulate Capture (since we can't use real camera in headless often)
    await page.click('button:has-text("Capture")');
    await expect(page).toHaveURL(/\/processing/);

    // 4. Wait for processing (animation simulation)
    await expect(page).toHaveURL(/reading\/123/, { timeout: 10000 });

    // 5. Verify Reading Results
    await expect(page.locator('text=Personality')).toBeVisible();
    await expect(page.locator('text=Career')).toBeVisible();
  });

  test('Registered User Flow: Login and History', async ({ page }) => {
    // 1. Mock Login (simulation)
    await page.goto('/');
    // Assuming a login modal or page exists
    await page.click('text=Sign In');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 2. View History
    await page.click('text=History');
    await expect(page.locator('.reading-card')).toHaveCount(1);
  });

  test('Ad Logic: Ad display after 2nd reading', async ({ page }) => {
    // 1. First Reading
    await page.goto('/scan');
    await page.click('button:has-text("Capture")');
    await page.waitForURL(/reading/);
    
    // 2. Second Reading
    await page.click('text=New Reading');
    await page.click('button:has-text("Capture")');
    await page.waitForURL(/reading/);

    // 3. Verify Ad Banner visibility or Interstitial modal
    const adBanner = page.locator('text=Advertisement');
    await expect(adBanner).toBeVisible();
  });

  test('PDF Export: Generation and Download', async ({ page }) => {
    await page.goto('/reading/123');

    // 1. Click Download Report
    const [ download ] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Download")')
    ]);

    // 2. Verify filename
    expect(download.suggestedFilename()).toContain('PALMSTRY_Report');
  });
});
