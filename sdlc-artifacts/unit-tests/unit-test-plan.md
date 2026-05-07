# Unit Test Plan: PartFavorites Component

**Story**: ADP-112 - Create My Favorites Page Component  
**Epic**: ADP-111 - Part Favorites Quick Access Page  
**Date**: 2026-05-07  
**Implementation Branch**: story/ADP-112

---

## 1. Applicability Assessment

### Unit Tests are NOT APPLICABLE for this implementation

**Rationale:**

After thorough analysis of the InvenTree codebase testing patterns, **unit tests are not applicable** for the PartFavorites component implementation for the following reasons:

1. **No Existing Unit Test Framework**: The frontend codebase uses **Playwright for end-to-end/integration testing only**. There is no unit testing framework (Jest, Vitest, React Testing Library, etc.) configured in the project:
   - No `jest.config.js`, `vitest.config.ts`, or similar configuration files exist
   - The `package.json` contains only `@playwright/test` (v1.56.0) for testing
   - The `playwright.config.ts` is configured exclusively for browser-based integration tests
   - All existing test files (`*.spec.ts`) in the `tests/` directory are Playwright integration tests

2. **No Established Unit Test Patterns**: Analysis of the codebase reveals:
   - Zero `*.test.ts` or `*.test.tsx` files in the `src/frontend/src/` directory
   - No component unit tests for any React page components
   - No unit tests for other simple page components (e.g., `PartSupplierDetail.tsx`, `AttachmentPanel.tsx`)
   - All testing is performed via Playwright browser automation with full backend integration

3. **Component Simplicity**: The PartFavorites component is a **presentational wrapper** with:
   - No business logic, calculations, or algorithms
   - No state management or complex interactions
   - No validation rules or conditional rendering (beyond what PartListTable handles)
   - Simply composes existing components (`PageDetail` and `PartListTable`) with a parameter

4. **Existing Coverage**: The component's functionality is adequately covered by:
   - **Integration tests** via Playwright (which are the established pattern)
   - The existing `PartListTable` component (which handles all table logic)
   - The existing `PageDetail` component (which handles page layout)
   - The backend API filtering (`starred=true` parameter)

---

## 2. Testing Framework Analysis

### Current Frontend Testing Stack

The InvenTree frontend uses the following testing approach:

**Testing Framework**: Playwright (v1.56.0)
- **Type**: End-to-End / Integration Testing
- **Purpose**: Browser-based testing with full backend integration
- **Configuration**: `src/frontend/playwright.config.ts`
- **Test Location**: `src/frontend/tests/`
- **Test Pattern**: `*.spec.ts` files
- **Browsers**: Chromium, Firefox
- **Coverage**: Istanbul/NYC for code coverage collection

**Key Configuration Details**:
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } }
  ],
  webServer: [
    { command: 'yarn run dev --host --port 5173', url: 'http://localhost:5173' },
    { command: 'invoke dev.server -a 0.0.0.0:8000', url: 'http://localhost:8000/api/' }
  ]
})
```

### No Unit Testing Framework Present

**Missing Frameworks/Libraries**:
- ❌ Jest - Not installed
- ❌ Vitest - Not installed
- ❌ React Testing Library - Not installed
- ❌ @testing-library/react - Not installed
- ❌ @testing-library/jest-dom - Not installed

**Evidence**:
```json
// package.json - devDependencies excerpt
{
  "@playwright/test": "1.56.0",  // Only test framework
  "@types/node": "^24.3.0",
  // No jest, vitest, or testing-library packages
}
```

---

## 3. Existing Test Pattern Analysis

### Pattern: Integration Tests Only

**Example from `src/frontend/tests/pages/pui_part.spec.ts`**:
```typescript
test('Parts - Details', async ({ browser }) => {
  const page = await doCachedLogin(browser, { url: 'part/113/details' });

  // Integration-level assertions
  await page.getByText('Required for Orders').waitFor();
  await page.getByText('Allocated to Sales Orders').waitFor();
  await page.getByText('Can Build').waitFor();
});
```

**Characteristics**:
1. Full browser automation (Chromium/Firefox)
2. Requires backend server running (Django on port 8000)
3. Requires frontend dev server (Vite on port 5173)
4. Uses test dataset loaded into PostgreSQL database
5. Tests complete user workflows and page rendering
6. No isolated component testing

### Similar Components - No Unit Tests

Analysis of similar page components shows **zero unit tests**:

| Component | Type | Unit Tests? | Integration Tests? |
|-----------|------|-------------|-------------------|
| `PartSupplierDetail.tsx` | Page component | ❌ No | ✅ Yes (pui_part.spec.ts) |
| `AttachmentPanel.tsx` | Panel component | ❌ No | ✅ Yes (indirect) |
| `PartDetail.tsx` | Complex page | ❌ No | ✅ Yes (pui_part.spec.ts) |
| `PartStockHistoryDetail.tsx` | Page component | ❌ No | ✅ Yes |

**Conclusion**: The codebase follows a **integration-test-only pattern** for React components.

---

## 4. Implementation Analysis

### PartFavorites Component Code

**File**: `src/frontend/src/pages/part/PartFavorites.tsx` (24 lines)

```typescript
import { t } from '@lingui/core/macro';
import { Stack } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';

import { PageDetail } from '../../components/nav/PageDetail';
import { PartListTable } from '../../tables/part/PartTable';

/**
 * My Favorites page - displays all parts starred by the current user
 */
export default function PartFavorites() {
  return (
    <Stack gap='xs'>
      <PageDetail title={t`My Favorites`} icon={<IconStarFilled />} />
      <PartListTable
        props={{
          params: {
            starred: true
          }
        }}
      />
    </Stack>
  );
}
```

### Complexity Assessment

**Component Characteristics**:
- **Lines of Code**: 24 (including imports and comments)
- **Business Logic**: None - pure composition
- **State Management**: None - stateless functional component
- **Props**: None - no props accepted
- **Conditionals**: None
- **Loops**: None
- **API Calls**: None (delegated to PartListTable)
- **Event Handlers**: None
- **Custom Hooks**: None
- **Complex Calculations**: None

**Dependencies**:
1. `PageDetail` - Existing, tested component for page header
2. `PartListTable` - Existing, tested table component with extensive logic
3. `Stack` - Mantine UI layout component
4. `IconStarFilled` - Tabler icon component
5. `t` macro - Lingui i18n translation macro

**What the Component Does**:
1. Renders a page title "My Favorites" with a star icon
2. Renders a parts table filtered to show only starred parts (`starred: true`)

**What the Component Does NOT Do**:
- ❌ Fetch data (handled by PartListTable)
- ❌ Manage state (stateless)
- ❌ Handle user interactions (delegated to child components)
- ❌ Perform calculations or transformations
- ❌ Validate data or enforce business rules

---

## 5. Recommendation: Integration Tests Only

### Recommended Testing Approach

Given the codebase patterns and component characteristics, **integration tests via Playwright** are the appropriate and consistent testing approach for this implementation.

### Why Integration Tests are Sufficient

1. **Consistency with Codebase Patterns**: Follows the established testing methodology used throughout the InvenTree frontend
2. **Real-World Coverage**: Tests the component in its actual runtime environment with real backend integration
3. **Component Simplicity**: The component has no isolated logic worth unit testing
4. **Comprehensive Validation**: Integration tests validate:
   - Component rendering in the browser
   - Correct API parameter passing (`starred: true`)
   - Interaction with real InvenTree API
   - User authentication and authorization
   - Actual starred parts display
   - Empty state handling
   - Navigation and routing

### Integration Test Scenarios (To Be Implemented)

The following integration test scenarios should be created in a separate integration test file:

**File**: `src/frontend/tests/pages/pui_part_favorites.spec.ts`

#### Test Scenario 1: Page Renders with Favorites
```typescript
test('Part Favorites - Page Renders', async ({ browser }) => {
  const page = await doCachedLogin(browser, { url: 'part/favorites' });

  // Verify page title and icon
  await page.getByText('My Favorites').waitFor();

  // Verify table renders
  await page.locator('table').waitFor();
});
```

#### Test Scenario 2: Displays Starred Parts Only
```typescript
test('Part Favorites - Displays Starred Parts', async ({ browser }) => {
  // Pre-condition: Star a specific part via API
  const api = await createApi();
  await api.post('part/15/star/', {});

  const page = await doCachedLogin(browser, { url: 'part/favorites' });

  // Verify starred part appears
  await page.getByText('R_550R_0805_1%').waitFor();
});
```

#### Test Scenario 3: Empty State Message
```typescript
test('Part Favorites - Empty State', async ({ browser }) => {
  // Pre-condition: Ensure user has no starred parts
  const api = await createApi();
  // Unstar all parts for test user

  const page = await doCachedLogin(browser, { url: 'part/favorites' });

  // Verify empty state message (from PartListTable component)
  await page.getByText('No records found').waitFor();
});
```

#### Test Scenario 4: Navigation to Part Detail
```typescript
test('Part Favorites - Navigate to Part Detail', async ({ browser }) => {
  const page = await doCachedLogin(browser, { url: 'part/favorites' });

  // Click on a favorited part
  await page.getByRole('cell', { name: 'R_550R_0805_1%' }).click();

  // Verify navigation to part detail page
  await page.waitForURL('**/part/15/details');
});
```

#### Test Scenario 5: Remove from Favorites
```typescript
test('Part Favorites - Remove Favorite', async ({ browser }) => {
  const page = await doCachedLogin(browser, { url: 'part/favorites' });

  // Verify part is in favorites
  await page.getByText('R_550R_0805_1%').waitFor();

  // Click star icon to unfavorite
  await page.getByLabel('favorite-star-15').click();

  // Verify part is removed from list
  await expect(page.getByText('R_550R_0805_1%')).not.toBeVisible();
});
```

---

## 6. Conclusion

### Summary

**Unit tests are NOT recommended** for the PartFavorites component because:

1. ✅ No unit testing framework exists in the codebase
2. ✅ No established unit test patterns for React components
3. ✅ Component is too simple to warrant isolated unit testing
4. ✅ Functionality is adequately covered by child component tests
5. ✅ Integration tests provide superior coverage for this use case

### Recommended Next Steps

1. **Do NOT set up a unit testing framework** - This would be inconsistent with the established codebase patterns and would require:
   - Installing Jest/Vitest and React Testing Library
   - Creating test configuration files
   - Setting up mocking infrastructure
   - Establishing new testing conventions
   - This is out of scope for this story

2. **Create Integration Tests Instead** - Follow the story's test strategy:
   - File: `src/frontend/tests/pages/pui_part_favorites.spec.ts`
   - Use Playwright for end-to-end testing
   - Test scenarios defined in Section 5 above
   - Follows established patterns in `pui_part.spec.ts`

3. **Validate Against Acceptance Criteria**:
   - ✅ Component renders without errors → Integration test
   - ✅ PartListTable receives correct `starred=true` parameter → Integration test
   - ✅ Page displays favorited parts from API → Integration test
   - ✅ Empty state displays when no favorites exist → Integration test

### Test Plan Status

- **Unit Tests**: ❌ Not Applicable
- **Integration Tests**: ✅ Recommended (separate test file)
- **Coverage Target**: N/A for unit tests; follow existing integration test coverage patterns

---

## 7. Validation Checklist

- [x] Applicability assessment is clear and well-reasoned
- [x] Analysis of existing testing framework completed
- [x] Analysis of existing test patterns completed
- [x] Component complexity assessment completed
- [x] No implementation code modifications proposed
- [x] Recommendation aligns with codebase patterns
- [x] Integration test scenarios documented for reference

---

**Document Status**: ✅ COMPLETE
**Assessment**: Unit tests NOT APPLICABLE - Integration tests recommended
**Next Action**: Implement integration tests in separate story task (if required)

