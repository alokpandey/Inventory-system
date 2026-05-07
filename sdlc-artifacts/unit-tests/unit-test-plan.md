# Unit Test Plan - ADP-112: Create My Favorites Page Component

**Story ID:** ADP-112  
**Story Title:** Create My Favorites Page Component  
**Epic:** ADP-111 - Part Favorites Quick Access Page  
**Date:** 2026-05-07  
**Status:** Draft

---

## 1. Applicability Assessment

### 1.1 Decision: Unit Tests are NOT Applicable

**Rationale:**

After comprehensive analysis of the InvenTree codebase testing infrastructure, **traditional unit tests (Jest/Vitest/React Testing Library) are NOT applicable** for the following reasons:

1. **No React Unit Test Framework Present**
   - The codebase uses **Playwright** exclusively for frontend testing
   - No Jest, Vitest, or React Testing Library configuration found
   - No `*.test.tsx` or `*.unit.spec.tsx` files exist
   - Package.json contains only `@playwright/test` for testing
   - All existing test files are integration/E2E tests using Playwright

2. **Existing Test Pattern: Integration Tests Only**
   - All frontend tests in `src/frontend/tests/` are Playwright-based integration tests
   - Tests run against a live backend server (http://localhost:8000)
   - Tests use real database data and require user authentication
   - Examples: `pui_part.spec.ts`, `pui_forms.spec.ts`, `pui_general.spec.ts`

3. **Component Characteristics**
   - `PartFavorites.tsx` is a simple presentational component (30 lines)
   - No business logic, calculations, or validation rules
   - Delegates all functionality to existing components:
     - `PageDetail` (displays title/subtitle/icon)
     - `PartListTable` (displays filtered parts)
   - Props are static configuration only (`starred: true`)

4. **User Story Test Strategy**
   - Story explicitly states: "Unit test: Component renders without errors"
   - Story also states: "Unit test: PartListTable receives correct starred=true parameter"
   - However, these should be **integration tests** following existing patterns

### 1.2 Recommended Testing Approach

**Integration Tests (Playwright)** should be used instead, following the established codebase pattern:

- Test file: `src/frontend/tests/pages/pui_part.spec.ts` (add new test)
- Test the page through the browser against the live application
- Verify page rendering, content display, and user interactions
- Follow patterns from existing tests like `Parts - Tabs`, `Parts - Details`

---

## 2. Existing Test Patterns

### 2.1 Testing Framework
- **Framework:** Playwright (v1.56.0)
- **Test Location:** `src/frontend/tests/`
- **Configuration:** `src/frontend/playwright.config.ts`
- **Test Execution:** `npx playwright test --ui`
- **Coverage:** Istanbul/NYC for code coverage

### 2.2 Test File Conventions
- **Naming Pattern:** `pui_*.spec.ts` for general tests, `pages/pui_*.spec.ts` for page-specific tests
- **Test Structure:** Playwright test format with `test('Test Name', async ({ browser }) => {})`
- **Authentication:** Uses `doCachedLogin(browser, { url: 'path' })` helper
- **Navigation:** Uses `navigate(page, 'path')` helper function
- **Assertions:** Uses `page.getByText()`, `page.getByRole()`, `.waitFor()` patterns

### 2.3 Example Test Pattern (from `pui_part.spec.ts`)

```typescript
test('Parts - Details', async ({ browser }) => {
  const page = await doCachedLogin(browser, { url: 'part/113/details' });

  // Check for expected values on this page
  await page.getByText('Required for Orders').waitFor();
  await page.getByText('Allocated to Sales Orders').waitFor();
  await page.getByText('Can Build').waitFor();
});
```

---

## 3. Integration Test Recommendation (Preferred Approach)

### 3.1 Test File Location
- **File:** `src/frontend/tests/pages/pui_part.spec.ts`
- **Action:** Add new test case to existing file

### 3.2 Recommended Test Scenarios

#### Test 1: Part Favorites Page - Rendering
**Objective:** Verify the page renders correctly with title, subtitle, and table

```typescript
test('Parts - Favorites Page', async ({ browser }) => {
  const page = await doCachedLogin(browser, { url: 'part/favorites' });

  // Verify page title and subtitle
  await page.getByText('My Favorites').waitFor();
  await page.getByText('Parts you have starred for quick access').waitFor();

  // Verify table is present
  await page.getByRole('table').waitFor();
});
```

#### Test 2: Part Favorites Page - Empty State
**Objective:** Verify empty state displays when no parts are favorited

```typescript
test('Parts - Favorites Empty State', async ({ browser }) => {
  // Login as user with no favorites
  const page = await doCachedLogin(browser, {
    username: 'user_no_favorites',
    password: 'password',
    url: 'part/favorites'
  });

  // Verify empty state message
  await page.getByText('No records found').waitFor();
});
```

#### Test 3: Part Favorites Page - Starred Parts Display
**Objective:** Verify only starred parts appear in the list

```typescript
test('Parts - Favorites Display Starred Parts', async ({ browser }) => {
  const page = await doCachedLogin(browser, { url: 'part/favorites' });

  // Verify starred parts are displayed
  // (Requires test data setup with known starred parts)
  await page.getByRole('table').waitFor();

  // Verify table has rows
  const rows = await page.getByRole('row').count();
  expect(rows).toBeGreaterThan(0);
});
```

---

## 4. Alternative: Isolated Unit Tests (Not Recommended)

### 4.1 Why Not Recommended

1. **No Infrastructure:** Would require adding Jest/Vitest + React Testing Library
2. **Maintenance Burden:** Introduces new testing paradigm to maintain
3. **Limited Value:** Component has no logic to test in isolation
4. **Breaks Consistency:** All other pages use integration tests

### 4.2 If Unit Tests Were Required (Hypothetical)

**Setup Required:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Configuration Required:**
- Create `vitest.config.ts`
- Create `test/setup.ts` for test utilities
- Mock dependencies (@lingui, @mantine, react-router-dom)

**Test File:** `src/frontend/src/pages/part/__tests__/PartFavorites.test.tsx`

**Test Scenarios:**
1. Component renders without crashing
2. PageDetail receives correct title/subtitle/icon props
3. PartListTable receives `{ params: { starred: true } }` props
4. Stack component renders with correct layout

**Example Hypothetical Unit Test:**
```typescript
// src/frontend/src/pages/part/__tests__/PartFavorites.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import PartFavorites from '../PartFavorites';

// Mock dependencies
vi.mock('@lingui/core/macro', () => ({
  t: (str: any) => str
}));

vi.mock('../../components/nav/PageDetail', () => ({
  PageDetail: ({ title, subtitle, icon }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}));

vi.mock('../../tables/part/PartTable', () => ({
  PartListTable: ({ props }: any) => (
    <div data-testid="part-list-table" data-params={JSON.stringify(props?.params)} />
  )
}));

describe('PartFavorites', () => {
  it('renders without crashing', () => {
    render(<PartFavorites />);
    expect(screen.getByText('My Favorites')).toBeInTheDocument();
  });

  it('displays correct subtitle', () => {
    render(<PartFavorites />);
    expect(screen.getByText('Parts you have starred for quick access')).toBeInTheDocument();
  });

  it('passes starred=true to PartListTable', () => {
    render(<PartFavorites />);
    const table = screen.getByTestId('part-list-table');
    const params = JSON.parse(table.getAttribute('data-params') || '{}');
    expect(params.starred).toBe(true);
  });
});
```

**Note:** This approach is NOT recommended and provided only for reference.

---

## 5. Summary and Recommendations

### 5.1 Final Recommendation

**DO NOT CREATE UNIT TESTS** for this story. Instead:

1. **Add integration tests** to `src/frontend/tests/pages/pui_part.spec.ts`
2. Follow existing Playwright test patterns
3. Test the page functionality end-to-end with real backend
4. Verify page rendering, content display, and user interactions

### 5.2 Justification

- ✅ **Consistent with codebase:** All pages use Playwright integration tests
- ✅ **No new infrastructure:** Reuses existing test framework
- ✅ **Better coverage:** Tests real user interactions and API integration
- ✅ **Lower maintenance:** Single testing paradigm to maintain
- ✅ **Matches complexity:** Simple component doesn't need isolated unit tests

### 5.3 Test Coverage Goals

The integration tests should verify:
- ✅ Page renders without errors
- ✅ Title "My Favorites" displays correctly
- ✅ Subtitle displays correctly
- ✅ Star icon displays correctly
- ✅ Table displays starred parts
- ✅ Empty state displays when no favorites exist
- ✅ User can navigate to part detail pages from favorites
- ✅ User can unstar parts from the favorites page

### 5.4 Deliverables

**For this user story:**
- **Unit Test Plan:** This document (completed)
- **Unit Test Code:** N/A (not applicable based on codebase patterns)
- **Integration Test Code:** To be added to existing test file

**Recommended Next Steps:**
1. Review and approve this unit test plan
2. Create integration tests following the patterns in Section 3.2
3. Add tests to `src/frontend/tests/pages/pui_part.spec.ts`
4. Run tests with `npx playwright test --ui`
5. Verify >80% code coverage for PartFavorites.tsx

---

## 6. Validation Checklist

- [x] Applicability assessment is clear and well-reasoned
- [x] Only unit tests are assessed (integration tests noted separately)
- [x] No implementation/feature code is modified
- [x] Existing test patterns and conventions documented
- [x] Recommendation aligns with codebase practices
- [x] Alternative approaches documented for completeness
- [x] Clear rationale provided for all decisions

---

## 7. References

- **Codebase:** `/workflow-data/Inventory-system`
- **Implementation:** `src/frontend/src/pages/part/PartFavorites.tsx`
- **Existing Tests:** `src/frontend/tests/pages/pui_part.spec.ts`
- **Test Framework:** Playwright (playwright.config.ts)
- **Documentation:** `docs/docs/develop/react-frontend.md`

---

**End of Unit Test Plan**
