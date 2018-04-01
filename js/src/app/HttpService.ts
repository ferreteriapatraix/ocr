import { RequestError } from '../errors/RequestError';
import { Configuration } from './Configuration';
import { IFile, IReducedFile } from './poto/File';
import { Util } from './Util';

/**
 * The http service.
 */
export class HttpService {

    constructor(private jquery: JQueryStatic, private config: Configuration, private util: Util) { }

    /**
     * Send the file ids and languages to Nextcloud and initiate the OCR process.
     * @param files The files to process.
     * @param languages The languages to process the files with.
     * @returns The JQueryXHR object.
     */
    public async startProcess(files: IFile[], languages: string[], replace: boolean): Promise<JQueryXHR> {
        const reducedFiles: IReducedFile[] = this.util.reduceFileArraySize(files);
        const options: JQueryAjaxSettings = {
            data: {
                files: reducedFiles,
                languages,
                replace,
            },
            method: 'POST',
            url: this.config.jobEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Retrieve the status of the OCR process.
     * @returns The JQueryXHR object.
     */
    public async checkStatus(): Promise<JQueryXHR> {
        const options: JQueryAjaxSettings = {
            method: 'GET',
            url: this.config.statusEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Retrieve all available languages for processing files.
     * @returns A string of languages separated by semicolon.
     */
    public async loadAvailableLanguages(): Promise<JQueryXHR> {
        const options: JQueryAjaxSettings = {
            method: 'GET',
            url: this.config.languagesEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Retrieves the status of the redis settings.
     * @returns A boolean value. True if all is set.
     */
    public async checkRedisSettings(): Promise<JQueryXHR> {
        const options: JQueryAjaxSettings = {
            method: 'GET',
            url: this.config.redisEvaluationEndpoint,
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
