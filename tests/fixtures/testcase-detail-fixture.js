import { test as base, TestType } from '@playwright/test';
import { TestCaseDetailPage } from '../../page-objects/testcase-detail'


/**
 * TestCaseDetail fixture.
 * @type { TestType<{ testCaseDetailPage: TestCaseDetailPage }, {}> }
 */
export const test = base.extend({
    testCasePage: async({page}, use) => {
        const testDetailPage = new TestCaseDetailPage()
        // Above: set up the fixture.
        await use(testDetailPage)
        // Below: Clean up the fixture
        // Do nothing
    }
})