import { RequestError } from '../errors/RequestError';
import { ValidationError } from '../errors/ValidationError';
import { IMultiTranslation, ISingleTranslation, OCNotification } from '../global-types';
import { HttpService } from './HttpService';
import { Util } from './Util';

declare var t: ISingleTranslation;
declare var n: IMultiTranslation;

/**
 * The controller.
 */
export class Controller {

    private applyLanguagesButton: HTMLButtonElement;
    private applyRedisButton: HTMLButtonElement;

    /**
     * Initializes the Controller / OCR admin settings in the frontend of Nextcloud.
     */
    constructor(private httpService: HttpService, private util: Util, private notification: OCNotification, private jquery: JQueryStatic,
                private document: Document) {
        this.registerEvents();
        this.applyLanguagesButton = this.document.getElementById('languages_apply') as HTMLButtonElement;
        this.applyRedisButton = this.document.getElementById('redis_apply') as HTMLButtonElement;
    }

    /**
     * Saves the languages.
     */
    public async saveLanguages(): Promise<void> {
        try {
            this.applyLanguagesButton.disabled = true;
            const languages = (this.document.getElementById('languages') as HTMLInputElement).value;
            this.util.checkLanguagesValidity(languages);
            await this.httpService.sendLanguages(languages);
            this.displayMessage(t('ocr', 'Saved.'), false);
        } catch (e) {
            if (e instanceof RequestError) {
                this.displayMessage(`${t('ocr', 'Saving languages failed:')} ${e.message}`, true);
            } else if (e instanceof ValidationError) {
                this.displayMessage(e.message, true);
            } else {
                throw e;
            }
        }
        this.applyLanguagesButton.disabled = false;
    }

    /**
     * Saves the redis settings.
     */
    public async saveRedis(): Promise<void> {
        try {
            this.applyRedisButton.disabled = true;
            const redisHost = (this.document.getElementById('redisHost') as HTMLInputElement).value;
            const redisPort = Number.parseInt((this.document.getElementById('redisPort') as HTMLInputElement).value, 10);
            const redisDb = Number.parseInt((this.document.getElementById('redisDb') as HTMLInputElement).value, 10);
            const redisPassword = (this.document.getElementById('redisPassword') as HTMLInputElement).value;
            this.util.checkRedisHostValidity(redisHost);
            this.util.checkRedisPortValidity(redisPort);
            this.util.checkRedisDbValidity(redisDb);
            await this.httpService.sendRedis(redisHost, `${redisPort}`, `${redisDb}`, `${redisPassword}`);
            this.displayMessage(t('ocr', 'Saved.'), false);
        } catch (e) {
            if (e instanceof RequestError) {
                this.displayMessage(`${t('ocr', 'Saving Redis settings failed:')} ${e.message}`, true);
            } else if (e instanceof ValidationError) {
                this.displayMessage(e.message, true);
            } else {
                throw e;
            }
        }
        this.applyRedisButton.disabled = false;
    }

    /**
     * Registers the events and the appropriate methods of the view.
     */
    private registerEvents(): void {
        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'languages_apply') {
                this.saveLanguages();
            }
        });
        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'redis_apply') {
                this.saveRedis();
            }
        });
    }

    /**
     * Displays a message in the top of Nextcloud.
     * @param message String to display.
     * @param error If a message is an error or not.
     */
    private displayMessage(message: string, error: boolean): void {
        if (error) {
            this.notification.showHtml(`<div>${t('ocr', 'OCR')}: ${message}</div>`, { timeout: 10, type: 'error' });
        } else {
            this.notification.showHtml(`<div>${t('ocr', 'OCR')}: ${message}</div>`, { timeout: 5 });
        }
    }
}
