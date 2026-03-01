import { test, expect } from '@playwright/test';

test('User can complete the survey and view dashboard', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/');
    await expect(page).toHaveTitle(/SkillGPS/);

    // 2. Start Survey
    await page.click('text="Start Your Journey"');
    // Click on the Take Survey option from the modal
    await page.click('text="Take Survey & Get Personalized Recommendations"');

    // We should be on the survey page
    await expect(page).toHaveURL(/.*\/survey/);

    // Fill out the survey - Step 1: Interests
    // Select "Yes" for the first question
    await page.locator('.interest-btn-yes').first().click();
    // We need to click "Yes" for all 5 to pass validateStep()
    const yesButtons = page.locator('.interest-btn-yes');
    await yesButtons.nth(0).click();
    await yesButtons.nth(1).click();
    await yesButtons.nth(2).click();
    await yesButtons.nth(3).click();
    await yesButtons.nth(4).click();
    await page.click('text="Next"'); // Go to step 2

    // Step 2: Work Style
    await page.click('text="Solo"');
    await page.click('text="Structured"');
    await page.click('text="Desk Job"');
    await page.click('text="Next"'); // Go to step 3

    // Step 3: Intent
    await page.click('text="Get a Job"');
    await page.click('text="Startup (Fast-paced, wearing multiple hats)"');
    await page.click('text="Applied Engineering / Product"');
    await page.click('text="Next"'); // Go to step 4

    // Step 4: Confidence sliders (using defaults is fine)
    await page.click('text="Finish"');

    // 3. Results page
    await expect(page).toHaveURL(/.*\/results/);
    // Wait for AI results to load
    await expect(page.locator('text="Your Perfect Career Matches"')).toBeVisible({ timeout: 10000 });

    // 4. Click top match and go to Dashboard
    await page.click('text="Start Learning Path"');

    // Should navigate to dashboard
    // "dashboard" URL or query param
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('text="Your Learning Path:"')).toBeVisible();
});
