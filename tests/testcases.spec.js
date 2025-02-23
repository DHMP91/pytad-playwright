import { testCasePageFixture, fakeTestDataFixture } from './fixtures/testcases-page-fixture'
import { expect, mergeTests } from '@playwright/test';


const test = mergeTests(testCasePageFixture, fakeTestDataFixture)

test.describe("Listing Testcases", () => {
    const maxItems = 10;

    test(`should listing max ${maxItems} items`, async ( {testCasePage} ) => {
        const testCases = await testCasePage.getTestCases();
        expect(testCases.length).toBeLessThanOrEqual(maxItems);
    });

    test("should have table headers", async ( {testCasePage} ) => {
        const headers = await testCasePage.getHeaders();
        const expectedHeaders = ["id", "name", "relative_path", "internal_id", "Last Run", "History"];
        for(const header of headers){
            const expectedHeader = expectedHeaders.shift();
            await expect(header).toHaveText(expectedHeader);
        }
    });

    test("should have correct test case detail", async ({testCasePage, fakeTestCase}) => {
        // Find test case
        const matchTestCase = await testCasePage.findTestCase(fakeTestCase.name)
        // Validate testcase column data
        expect(matchTestCase).not.toBeNull();
        const expectedColumnValues = [fakeTestCase.id, fakeTestCase.name, fakeTestCase.relative_path, fakeTestCase.internal_id];
        const columns = await matchTestCase.locator("td").all();
        for(const expectedText of expectedColumnValues){
            const column = columns.shift()
            await expect(column).toHaveText(expectedText.toString());
        }
    });

    // test("should show overview of test run status", () => {
    // });

    // test("should be able to paginate through table", () => {
    // });

});
