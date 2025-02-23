import { testEnv } from "../environment-variables"
import { Page, Response, Locator } from "@playwright/test"

export class BasePage {
    _page
    baseURL

    /**
     * Base Page constructor
     * @param {Page} page Playwright page associated to context
     * @param {string} baseURL optional param to pass in base url. Defaults to dot env baseUrl
     */
    constructor(page, baseURL = testEnv.baseURL){
        this._page = page
        this.baseURL = baseURL
    }

    /**
     * Go to home page
     * @returns { Promise<null | Response> } Returns the main resource response
     */
    async goto(){
        return this._page.goto(`${this.baseURL}`)
    }

    /**
     * Helper method to get element info
     * @param { Locator } locator Playwright locator 
     * @returns {Promise<object>} Returns an objects with tagname, attribute(s), innertext and outerhtml
     */
    async elementInfo(locator){
        return locator.evaluate( el => ({
                tagName: el.tagName,
                attributes: Array.from(el.attributes).reduce((acc, attr) => {
                    acc[attr.name] = attr.value;
                    return acc;
                }, {}),
                innerText: el.innerText,
                outerHTML: el.outerHTML
        }));
    }
}