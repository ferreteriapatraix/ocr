import { RequestError } from '../errors/RequestError';
import { Configuration } from './Configuration';

/**
 * The http service.
 */
export class HttpService {

    constructor(private jquery: JQueryStatic, private config: Configuration) { }

    /**
     * Retrieve the jobs of the OCR process.
     * @returns The JQueryXHR object.
     */
    public async getAllJobs(): Promise<JQueryXHR> {
        const options: JQueryAjaxSettings = {
            method: 'GET',
            url: this.config.jobEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Delete a jobs object.
     * @returns The JQueryXHR object.
     */
    public async deleteJob(id: number): Promise<JQueryXHR> {
        const options: JQueryAjaxSettings = {
            data: {
                id,
            },
            method: 'DELETE',
            url: this.config.jobEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Make an Ajax call with content and endpoint specified in the given options.
     * @param opts The settings for the request.
     * @returns The JQueryXHR object.
     */
    private async makeRequest(opts: JQueryAjaxSettings): Promise<JQueryXHR> {
        try {
            return await this.jquery.ajax(opts);
        } catch (e) {
            throw new RequestError(e.status, e.responseJSON);
        }
    }
}
