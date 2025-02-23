import { request, APIResponse, APIRequestContext} from '@playwright/test';
import { testEnv } from '../environment-variables';

export class PyTADTestCaseClient {
    #testCaseBaseEndpoint = "/testcases/api/testcase";
    #requestContext = null;

    constructor(){
    }

    /**
    * @return { Promise<APIRequestContext> } 
    */
    async getRequestContext(){
        if (!this.#requestContext) {
            this.#requestContext = await request.newContext({
                baseURL: testEnv.pytadURL,
                extraHTTPHeaders: {
                    "Authorization": `token ${testEnv.pytadAPIKey}`,
                },
            });
        }
        return this.#requestContext;
    }

    /**
    * @param { NewTestCase } testCase
    * @return { Promise<APIResponse> } 
    */
    async newTestCase(testCase){
        const request = await this.getRequestContext()
        return request.post(this.#testCaseBaseEndpoint, { data: testCase.toJSON() } )
    }

        /**
    * @param { Number } id
    * @return { Promise<APIResponse> } 
    */
    async deleteTestCase(id){
        const request = await this.getRequestContext()
        return request.delete(`${this.#testCaseBaseEndpoint}/${id}`)
    }
}


export class TestCase {

    constructor(id, name, relative_path, code_hash, code, internal_id) {
        this.id = id
        this.name = name;
        this.relative_path = relative_path;
        this.code_hash = code_hash;
        this.code = code;
        this.internal_id = internal_id;
    }

    /**
     * Creates an instance of TestCase from a JSON object.
     * @param {Object} json 
     * @return {TestCase}
     */
    static fromJSON(json) {
        return new TestCase(
            json.id,
            json.name, 
            json.relative_path, 
            json.code_hash, 
            json.code, 
            json.internal_id,
        );
    }

    /**
     * Converts the instance to a JSON object.
     * @return {Object}
     */
    toJSON() {
        return {
            id: this.id, 
            name: this.name,
            relative_path: this.relative_path,
            code_hash: this.code_hash,
            code: this.code,
            internal_id: this.internal_id
        };
    }
}

export class NewTestCase extends TestCase {

    constructor(name, relative_path, code_hash, code, internal_id) {
        super(0, name, relative_path, code_hash, code, internal_id)
    }

    /**
     * Creates an instance of TestCase from a JSON object.
     * @param {Object} json 
     * @return {TestCase}
     */
    static fromJSON(json) {
        return new NewTestCase(
            json.name, 
            json.relative_path, 
            json.code_hash, 
            json.code, 
            json.internal_id,
        );
    }


    /**
     * Converts the instance to a JSON object.
     * @return {Object}
     */
    toJSON() {
        const json = super.toJSON()
        delete json.id
        return json
    }
}