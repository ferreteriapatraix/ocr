import { ISingleTranslation, OCNotification } from '../global-types';
import { IJob } from './poto/Job';

declare var t: ISingleTranslation;

/**
 * The view.
 */
export class View {

    /**
     * The element that holds the ocr personal settings view.
     */
    private el: Element | null;

    constructor(private document: Document, private jquery: JQueryStatic, private notification: OCNotification,
                private handlebarsTableTemplate: HandlebarsTemplateDelegate) {
        this.el = this.document.getElementById('ocr-settings');
    }

    /**
     * Displays a message.
     * @param message The message to display.
     */
    public displayMessage(message: string, error: boolean): void {
        if (error) {
            this.notification.showHtml(`<div>${t('ocr', 'OCR')}: ${message}</div>`, { timeout: 10, type: 'error' });
        } else {
            this.notification.showHtml(`<div>${t('ocr', 'OCR')}: ${message}</div>`, { timeout: 10 });
        }
    }

    /**
     * Renders the jobs table.
     * @param jobs The retrieved jobs objects.
     */
    public render(jobs: IJob[]): void {
        const html: string = this.renderTable(jobs);
        this.jquery(html).appendTo(this.el);
    }

    /**
     * Destroys the view.
     */
    public destroy(): void {
        if (this.el !== null) {
            this.el.innerHTML = '';
        }
    }

    /**
     * Renders the jobs table.
     * @returns The template as string.
     */
    private renderTable(jobs: IJob[]): string {
        const enabled: boolean = jobs && jobs.length > 0 ? true : false;
        jobs.forEach((job: any) => {
            job.replace = job.replace === '1' ? true : false;
        });
        return this.handlebarsTableTemplate({
            deleteText: t('ocr', 'Delete'),
            enabled,
            jobs,
            noPendingOrFailedText: t('ocr', 'No pending or failed OCR items found.'),
            refreshButtonText: t('ocr', 'Refresh'),
            tableHeadDeleteFromQueueText: t('ocr', 'Delete from queue'),
            tableHeadFileText: t('ocr', 'File'),
            tableHeadJobText: t('ocr', 'Status'),
            tableHeadLogText: t('ocr', 'Log'),
            tableHeadReplaceText: t('ocr', 'Replace by result'),
        });
    }
}
