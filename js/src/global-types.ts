import { Admin } from './admin/Admin';
import { App } from './app/App';
import { Personal } from './personal/Personal';

export type ISingleTranslation = (appName: string, translationString: string) => string;

export type IMultiTranslation = (appName: string, singleTranslationString: string, multipleTranslationString: string, count: number) => string;

// tslint:disable-next-line:interface-name
export interface OC {
    PERMISSION_UPDATE: string;
    Notification: OCNotification;
    /**
     * Generates the absolute url for the given relative url, which can contain parameters.
     * Parameters will be URL encoded automatically.
     * @param {string} url
     * @param {Array} params
     * @param {Object} options
     * @param {bool} [options.escape=true] enable/disable auto escape of placeholders (by default enabled)
     * @return {string} Absolute URL for the given relative URL
     */
    generateUrl(url: string, params?: any, options?: any): string;
}

// tslint:disable-next-line:interface-name
export interface OCA {
    Ocr: any;
    Files: any;
}

// tslint:disable-next-line:interface-name
export interface OCNotification {
    /**
     * Shows a notification as HTML without being sanitized before.
     * If you pass unsanitized user input this may lead to a XSS vulnerability.
     * Consider using show() instead of showHTML()
     * @param {string} html Message to display
     * @param {Object} [options] options
     * @param {string} [options.type] notification type
     * @param {int} [options.timeout=0] timeout value, defaults to 0 (permanent)
     * @return {jQuery} jQuery element for notification row
     */
    showHtml(html: string, options?: {timeout?: number, type?: 'error'}): JQueryStatic<HTMLElement>;

    /**
     * Hides a notification.
     * If a row is given, only hide that one.
     * If no row is given, hide all notifications.
     * @param {JQueryStatic} [$row] notification row
     * @param {Function} [callback] callback
     */
    hide($row: JQueryStatic<HTMLElement>, callback?: () => void): void;
}
