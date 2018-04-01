import { RequestError } from '../errors/RequestError';
import { ISingleTranslation } from '../global-types';
import { HttpService } from './HttpService';
import { IJob } from './poto/Job';
import { View } from './View';

declare var t: ISingleTranslation;

/**
 * The controller.
 */
export class Controller {

    private jobs: IJob[] = [];

    constructor(private document: Document, private jquery: JQueryStatic, private view: View, private httpService: HttpService) {
        this.loadAndRender();
        this.registerEvents();
    }

    /**
     * Retrieves the job objects of OCR.
     */
    public async loadAndRender(): Promise<void> {
        this.view.destroy();
        try {
            this.jobs = await this.httpService.getAllJobs();
        } catch (e) {
            if (e instanceof RequestError) {
                this.view.displayMessage(`${t('ocr', 'OCR jobs could not be retrieved:')} ${e.message}`, true);
            } else {
                throw e;
            }
        }
        this.view.render(this.jobs);
    }

    /**
     * Deletes a job object.
     * @param id The id of the job object to delete.
     */
    public async delete(id: number): Promise<void> {
        try {
            const job = this.jobs.find((j) => j.id === id);
            await this.httpService.deleteJob(job.id);
            this.loadAndRender();
            this.view.displayMessage(`${t('ocr', 'The job for the following file has been successfully deleted:')} ${job.originalFilename}`, false);
        } catch (e) {
            if (e instanceof RequestError) {
                this.view.displayMessage(`${t('ocr', 'Error during job deletion:')} ${e.message}`, true);
            } else {
                throw e;
            }
        }
    }

    /**
     * Registers the events and the appropriate methods of the view.
     */
    public registerEvents(): void {
        // Register click events for the OCR view
        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'ocr-search') {
                this.loadAndRender();
            }
        });

        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'ocr-delete' || event.target.parentNode.id === 'ocr-delete') {
                this.delete(event.target.closest('tr').dataset.id - 0);
            }
        });
    }
}
