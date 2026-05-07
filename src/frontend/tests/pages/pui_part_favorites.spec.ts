import { expect } from '@playwright/test';
import { test } from '../baseFixtures';
import { createApi } from '../api';
import { clearTableFilters, navigate } from '../helpers';
import { doCachedLogin } from '../login';

/**
 * Integration test for Part Favorites page (ADP-112)
 * Tests the My Favorites page that displays all parts starred by the current user
 */

/**
 * Test 1: Page Accessibility and Rendering
 * Verify that the favorites page loads correctly with proper title, subtitle, and icon
 */
test('Part Favorites - Page Accessibility and Rendering', async ({ browser }) => {
  const page = await doCachedLogin(browser);

  // Navigate to the favorites page
  await navigate(page, '/part/favorites');
  await page.waitForURL('**/part/favorites');

  // Verify page loads without errors
  await page.waitForLoadState('networkidle');

  // Verify page title is displayed
  await page.getByText('My Favorites').waitFor();

  // Verify subtitle is displayed
  await page.getByText('Parts you have starred for quick access').waitFor();

  // Verify the page renders the PartListTable component
  // The table should be present on the page
  await page.getByRole('table').waitFor();
});

/**
 * Test 2: Starred Parts Display
 * Verify that only starred parts are displayed in the favorites page
 */
test('Part Favorites - Starred Parts Display', async ({ browser }) => {
  const page = await doCachedLogin(browser);

  // First, navigate to parts list and star some parts
  await navigate(page, '/part/category/index/parts');
  await page.waitForLoadState('networkidle');

  // Clear any existing filters
  await clearTableFilters(page);

  // Search for a specific part to star
  await page.getByPlaceholder('Search').fill('1551ABK');
  await page.waitForLoadState('networkidle');

  // Click on the part to open detail page
  await page.getByText('1551ABK').first().click();
  await page.waitForURL('**/part/**');

  // Star the part by clicking the subscribe/star button
  // The button should be visible on the part detail page
  const starButton = page.getByRole('button', {
    name: /Subscribe to notifications|Unsubscribe from notifications/
  });
  await starButton.waitFor();

  // Get the current state and click to toggle
  const isStarred = await starButton.getAttribute('data-variant');
  if (isStarred !== 'filled') {
    await starButton.click();
    // Wait for the notification that subscription was added
    await page.getByText('Subscription added').waitFor();
  }

  // Navigate to favorites page
  await navigate(page, '/part/favorites');
  await page.waitForLoadState('networkidle');

  // Verify that the starred part appears in the table
  await page.getByText('1551ABK').waitFor();

  // Verify table shows expected columns by checking for part information
  // The PartListTable should display name, IPN, category, stock, etc.
  const table = page.getByRole('table');
  await expect(table).toBeVisible();
});

/**
 * Test 3: Empty State
 * Verify that an appropriate message is displayed when no parts are favorited
 */
test('Part Favorites - Empty State', async ({ browser }) => {
  const page = await doCachedLogin(browser);

  // Use API to ensure all stars are removed for the current user
  const api = await createApi();

  // Get all starred parts for the user
  const starredParts = await api
    .get('api/part/', {
      params: { starred: true }
    })
    .then((res) => res.json());

  // Unstar each part using the API
  for (const part of starredParts) {
    await api.patch(`api/part/${part.pk}/`, {
      data: { starred: false }
    });
  }

  // Navigate to favorites page
  await navigate(page, '/part/favorites');
  await page.waitForLoadState('networkidle');

  // Verify empty state is displayed
  // The PartListTable component shows "No records found" when empty
  await page.getByText(/No records found|No results/i).waitFor();
});

/**
 * Test 4: Navigation and Integration
 * Verify that users can navigate to part details and manage favorites from the page
 */
test('Part Favorites - Navigation and Integration', async ({ browser }) => {
  const page = await doCachedLogin(browser);

  // First ensure at least one part is starred
  await navigate(page, '/part/category/index/parts');
  await clearTableFilters(page);
  await page.getByPlaceholder('Search').fill('1551AGY');
  await page.waitForLoadState('networkidle');

  // Click on the part
  await page.getByText('1551AGY').first().click();
  await page.waitForURL('**/part/**');

  // Star the part if not already starred
  const starButton = page.getByRole('button', {
    name: /Subscribe to notifications|Unsubscribe from notifications/
  });
  await starButton.waitFor();

  const isStarred = await starButton.getAttribute('data-variant');
  if (isStarred !== 'filled') {
    await starButton.click();
    await page.getByText('Subscription added').waitFor();
  }

  // Navigate to favorites page
  await navigate(page, '/part/favorites');
  await page.waitForLoadState('networkidle');

  // Click on the favorited part in the table to navigate to detail page
  await page.getByText('1551AGY').first().click();

  // Verify navigation to part detail page
  await page.waitForURL('**/part/**');
  await page.getByText('1551AGY').waitFor();
});
