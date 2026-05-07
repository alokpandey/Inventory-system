# Unit Test Plan - My Favorites Page Component (ADP-112)

## Applicability Assessment

### Decision: Unit Tests Are NOT Applicable

**Rationale:**

After thorough analysis of the InvenTree frontend codebase, **traditional unit tests are NOT applicable** for the PartFavorites page component implementation. This decision is based on the following findings:

1. **No Unit Test Framework Present**: The codebase does NOT use any traditional unit testing frameworks:
   - No Jest configuration found
   - No Vitest configuration found
   - No React Testing Library installed
   - No `@testing-library/react` in package.json dependencies

2. **Existing Test Pattern - Playwright E2E Only**: The project exclusively uses **Playwright** for end-to-end (E2E) testing:
   - All test files are located in `src/frontend/tests/` with `.spec.ts` extension
   - Configuration: `playwright.config.ts` (not unit test config)
   - Pattern: Browser-based integration tests that interact with actual running application
   - Examples: `pui_part.spec.ts`, `pui_general.spec.ts`, `pui_scan.spec.ts`

3. **No Existing React Component Unit Tests**: Extensive search revealed:
   - ZERO `.test.tsx` or `.test.ts` files for React components
   - NO unit tests for similar page components (PartDetail, CompanyDetail, BuildDetail, etc.)
   - NO unit tests for table components (PartListTable, PartParameterTable, etc.)
   - NO unit tests for reusable components (PageDetail, PanelGroup, etc.)

4. **Codebase Testing Philosophy**: The InvenTree project follows an **integration-first testing approach**:
   - All frontend testing is done through Playwright E2E tests
   - Tests validate actual user workflows in a real browser environment
   - Backend is started as part of test setup (see `playwright.config.ts` webServer config)
   - Tests use real API interactions, not mocks

### Consistency with Codebase Standards

Following the **Unit Test Generation Policy**:

> "Unit tests are ONLY generated if applicable based on existing codebase patterns."

Since:
- The codebase has **NO existing unit tests** for similar functionality
- The codebase has **NO established unit test patterns** to follow
- Similar React page components have **NO corresponding unit tests**
- The project uses **Playwright E2E tests exclusively** for frontend validation

**Creating unit tests would violate established codebase conventions and introduce an entirely new testing paradigm that is not used anywhere else in the project.**

## Recommended Testing Approach

### Integration Tests (Playwright E2E)

Based on the user story acceptance criteria and existing test patterns, **integration tests** should be created using Playwright to validate the PartFavorites page:

#### Test File Location
`src/frontend/tests/pages/pui_part_favorites.spec.ts`

#### Test Scenarios

Following the pattern established in `pui_part.spec.ts`, `pui_scan.spec.ts`, and other page tests:

1. **Test: Part Favorites - Page Loads**
   - Navigate to My Favorites page
   - Verify page title "My Favorites" is displayed
   - Verify subtitle "Parts you have starred for quick access" is displayed
   - Verify IconStarFilled icon is present

2. **Test: Part Favorites - Displays Starred Parts**
   - Pre-condition: User has starred specific parts
   - Navigate to My Favorites page
   - Verify PartListTable is rendered
   - Verify table displays only starred parts
   - Verify table shows part name, IPN, category, and stock information

3. **Test: Part Favorites - Empty State**
   - Pre-condition: User has no starred parts
   - Navigate to My Favorites page
   - Verify empty state message is displayed
   - Verify table shows appropriate empty message

4. **Test: Part Favorites - Navigate to Part Detail**
   - Pre-condition: User has starred parts
   - Navigate to My Favorites page
   - Click on a part in the favorites table
   - Verify navigation to part detail page

5. **Test: Part Favorites - Remove from Favorites**
   - Pre-condition: User has starred parts
   - Navigate to My Favorites page
   - Click star icon to unstar a part
   - Verify part is removed from favorites list
   - Verify table updates to reflect change

6. **Test: Part Favorites - Table Filtering Disabled**
   - Navigate to My Favorites page
   - Verify import functionality is disabled (enableImport=false)
   - Verify only starred filter is applied (params: { starred: true })

### Test Pattern Reference

Tests should follow the existing Playwright patterns:

```typescript
// Example from pui_part.spec.ts
test('Part Favorites - Basic Display', async ({ browser }) => {
  const page = await doCachedLogin(browser, { 
    url: 'part/favorites' 
  });

  await page.getByText('My Favorites').waitFor();
  await page.getByText('Parts you have starred for quick access').waitFor();
  
  // Verify table loads
  await page.getByRole('table').waitFor();
});
```

## Files Affected

### No Unit Test Files Created
- ❌ No `.test.tsx` files
- ❌ No Jest/Vitest configuration
- ❌ No React Testing Library setup

### Integration Test Files (To Be Created Separately)
- ✅ `src/frontend/tests/pages/pui_part_favorites.spec.ts` (Playwright E2E test)

## Summary

**Unit tests are NOT applicable** for this implementation because:

1. The codebase does not have a unit testing framework
2. No existing React component unit tests exist as precedent
3. The project uses Playwright E2E tests exclusively
4. Creating unit tests would violate codebase conventions

**Integration tests using Playwright** are the appropriate testing approach for this feature, consistent with all other frontend testing in the InvenTree project.

The user story's acceptance criteria mentioning "unit tests" should be interpreted as "automated tests" - which in this codebase means Playwright integration tests, not traditional isolated unit tests.

## Next Steps

Since unit tests are not applicable:

1. **Do NOT create** traditional unit test files
2. **Do NOT install** Jest, Vitest, or React Testing Library
3. **Recommend** creating Playwright E2E tests in `src/frontend/tests/pages/pui_part_favorites.spec.ts`
4. **Follow** existing E2E test patterns from `pui_part.spec.ts` and similar files
5. **Coordinate** with the team to update the user story acceptance criteria to reflect "E2E tests" instead of "unit tests"

