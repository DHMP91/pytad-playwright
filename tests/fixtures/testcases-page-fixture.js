import { test as base, TestType} from '@playwright/test';
import { TestCasesPage } from '../../page-objects/testcases'
import { TestCase, NewTestCase, PyTADTestCaseClient} from '../../api/pytad-client';
import { randomUUID } from 'crypto';


/**
 * TestCasePage fixture.
 * @type { TestType<{ testCasePage: TestCasesPage }, {}> }
 */
export const testCasePageFixture = base.extend({
    testCasePage: async({page}, use) => {
        const testCasePage = new TestCasesPage(page)
        await testCasePage.goto()
        // Above: set up the fixture.
        await use(testCasePage)
        // Below: Clean up the fixture
        // Do nothing
    }
})


/**
 * TestCasePage fixture.
 * @type { TestType<{ fakeTestCase: TestCase }, {}> }
 */
export const fakeTestDataFixture = base.extend({
    fakeTestCase: async({}, use) => {
        const uuid = randomUUID().toString()
        const newTestCase = new NewTestCase(
            `testCaseName${uuid}`,
            `relativePath${uuid}`,
            `code_hash${uuid}`,
            `code${uuid}`,
            `internal_id${uuid}`,
        )
        const client = new PyTADTestCaseClient()
        const response = await client.newTestCase(newTestCase)
        const testCase = TestCase.fromJSON(await response.json())
        // Above: set up the fixture.
        await use(testCase)
        // Below: Clean up the fixture
        const deleteResponse = await client.deleteTestCase(testCase.id)
        if(!deleteResponse.ok()){
            console.debug(`Failed to delete test case ${testCase.id} in fakeTestDataFixture`)
        }

    }
})