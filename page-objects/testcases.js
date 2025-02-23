import { BasePage } from "./base"
import { Page, Response, Locator } from "@playwright/test"
const partialURL = "/testcases"
export class TestCasesPage extends BasePage {

    /**
     * @param { Page } page Playwright page
     */
    constructor(page){
        super(page)
        this.testCaseRowLocator = this._page.getByTestId("testcase")
        this.tableHeaders = this._page.locator("thead th")  // role columnheader and rowheader does not work
        this.nextButton = this._page.getByAltText("Next")
        this.previousButton = this._page.getByAltText("Previous")
    }

    /**
     * Go to test cases page of app
     * @returns { Promise<null | Response> } Returns the main resource response
     */
    async goto(){
        return this._page.goto(`${this.baseURL}${partialURL}`)
    }

    /**
     * Find all testcases in the table/page
     * @returns { Promise<Array<Locator>> } Return an array of testcases locators
     */
    async getTestCases(){
        return this.testCaseRowLocator.all()
    }

    /**
     * Navigate through table to find matching test case name
     * @param { string } testCaseName Test case object to match by name
     * @returns { Promise<Locator> } Return the row matching test case name
     */
    async findTestCase(testCaseName){
        let matchTestCase = null;
        while(matchTestCase === null){
            // Look for testcase
            const testCases = await this.getTestCases();
            for(const testCase of testCases){
                const textArray = await testCase.allTextContents();
                const match = textArray.find((element) => element.includes(testCaseName));
                if(match !== undefined){
                    matchTestCase = testCase;
                    break;
                }
            }

            // Go next page
            try {
                await this.nextPage();
            } catch (e) {
                if( e instanceof NavigationError ) {
                    break;
                }else{
                    throw e;
                }
            }
        }
        return matchTestCase
    };

    /**
     * Return an array of table headers
     * @returns { Promise<Array<Locator>> } Return an array of headers locator
     */
    async getHeaders(){
        return this.tableHeaders.all()
    }

    /**
     * Go to next page for testcase table 
     * @returns { Promise<void> }
     */
    async nextPage(){
        return this.#navigatePage(this.nextButton, "End of page reached")
    }

    /**
     * Go to previous page of test case table
     * @returns { Promise<void> }
     */
    async previousPage(){
        return this.#navigatePage(this.previousButton, "Beginning of page reached")
    }

    async #navigatePage(navButton, message){
        const parentTag = await navButton.evaluate(el => el.parentElement.tagName )
        if (parentTag == "A"){
            let testcases = await this.getTestCases()
            const id = await (await testcases[0].locator("td").all())[0].innerText()
            const responsePromise = this._page.waitForResponse(response => 
                response.url().includes("testcases?page=")
            );
            await navButton.click()
            await responsePromise
            
            // Wait for new data to load
            let newId = id
            while(id === newId){
                testcases = await this.getTestCases()
                newId = await (await testcases[0].locator("td").all())[0].innerText()
            }
            return
        } else {
            throw new NavigationError(message)
        }
    }
}

export class NavigationError extends Error {
    constructor(message) {
        super(message);
        this.name = "NavigationError";
    }
}