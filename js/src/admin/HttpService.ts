import { RequestError } from '../errors/RequestError';
import { Configuration } from './Configuration';

/**
 * The http service.
 */
export class HttpService {

    constructor(private jquery: JQueryStatic, private config: Configuration) {}

    /**
     * Send the languages to the settings endpoint.
     * @param languages The languages that are available in the worker.
     * @returns The JQueryXHR object.
     */
    public async sendLanguages(languages: string): Promise<JQueryXHR> {
        const options: JQueryAjaxSettings = {
            data: {
                languages,
            },
            method: 'POST',
            url: this.config.languagesSettingsEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Send the redis settings to the settings endpoint.
     * @param redisHost The Redis host address.
     * @param redisPort The Redis port number.
     * @param redisDb The Redis database.
     * @returns The JQueryXHR object.
     */
    public async sendRedis(redisHost: string, redisPort: string, redisDb: string, redisPassword: string): Promise<JQueryXHR> {
        const options: JQueryAjaxSettings = {
            data: {
                redisDb,
                redisHost,
                redisPassword,
                redisPort,
            },
            method: 'POST',
            url: this.config.redisSettingsEndpoint,
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
