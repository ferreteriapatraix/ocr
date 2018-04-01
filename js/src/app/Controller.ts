import { IMultiTranslation, ISingleTranslation } from '../global-types';
import { HttpService } from './HttpService';
import { OcaService } from './OcaService';
import { File, IFile } from './poto/File';
import { IStatus } from './poto/Status';
import { Util } from './Util';
import { View } from './View';

declare var t: ISingleTranslation;
declare var n: IMultiTranslation;

/**
 * The controller.
 */
export class Controller {

    private selectedFiles: IFile[];
    private availableLanguages: string[];
    private status: IStatus;

    constructor(private document: Document, private jquery: JQueryStatic, private util: Util, private view: View, private httpService: HttpService,
                private ocaService: OcaService) {
        this.startEverything();
    }

    /**
     * Setup all the Events and load the languages and start the app.
     */
    public async startEverything() {
        try {
            await this.httpService.checkRedisSettings();
            await this.loadLanguages();
            this.registerEvents();
            this.view.renderSelectedFilesActionButton();
            this.loopForStatus();
        } catch (e) {
            this.view.displayError(`${e.message}`);
        }
    }

    /**
     * Destroys the OCR functions.
     */
    public destroy(): void {
        this.view.destroy();
        this.ocaService.destroy();
    }

    /**
     * Registers the events and the appropriate methods of the view.
     */
    public registerEvents(): void {
        // Register click events for the OCR view
        this.document.addEventListener('click', (event: any): any => {
            this.clickOnOtherEvent(event);
        });

        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'processOCR') {
                this.clickOnProcessButtonEvent();
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });

        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'process-ocr' || event.target.parentNode.id === 'process-ocr') {
                this.clickOnTopBarSelectedFilesActionButton();
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });

        // Register click events on file menu OCR option
        this.ocaService.registerFileActions();

        // Register checkbox events
        this.ocaService.registerCheckBoxEvents(this);
    }

    /**
     * Checks if the click events target was the OCR dropdown or not.
     * @param event The click event.
     */
    public clickOnOtherEvent(event: any): void {
        if (this.view.checkClickOther(event)) {
            this.selectedFiles = [];
            if (this.ocaService.getSelectedFiles().length === 0) {
                this.view.toggleSelectedFilesActionButton(false);
            }
        }
    }

    /**
     * Triggers the OCR process for the selectedFiles array
     * and toggles the "pending" state for the ocr process.
     */
    public async clickOnProcessButtonEvent(): Promise<void> {
        if (this.selectedFiles.length === 0) {
            this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${t('ocr', 'No file selected.')}`);
            this.view.destroyDropdown();
            return;
        }
        const filteredFiles: IFile[] = this.util.filterFilesWithMimeTypes(this.selectedFiles);
        if (filteredFiles.length === 0) {
            this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${t('ocr', 'MIME type not supported.')}`);
            this.view.destroyDropdown();
            return;
        }
        const selectedLanguages: string[] = this.view.getSelectTwoValues().length > 0 ? this.view.getSelectTwoValues() : ['any'];
        const replace = this.view.getReplaceValue();
        try {
            await this.httpService.startProcess(filteredFiles, selectedLanguages, replace);
            this.togglePendingState(true, filteredFiles.length);
            this.selectedFiles = [];
            setTimeout(this.jquery.proxy(this.loopForStatus, this), 4500); // TODO: evaluate other possibilities / mayb not needed (at least here)
        } catch (e) {
            this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${e.message}`);
        }
        this.view.destroyDropdown();
    }

    /**
     * Triggers the rendering of the OCR dropdown for the top bar
     * selected files action button and sets the selectedFiles.
     */
    public clickOnTopBarSelectedFilesActionButton(): void {
        this.view.renderFileAction(undefined, this.availableLanguages);
        this.selectedFiles = this.ocaService.getSelectedFiles();
    }

    /**
     * Triggers the view to show the selected files action button in the top bar
     * and sets the selectedFiles array.
     */
    public toggleSelectedFilesActionButton(): void {
        const selFiles: IFile[] = this.util.filterFilesWithMimeTypes(this.ocaService.getSelectedFiles());
        if (selFiles.length > 0) {
            this.view.toggleSelectedFilesActionButton(true);
            this.selectedFiles = selFiles;
        } else {
            this.view.toggleSelectedFilesActionButton(false);
            this.selectedFiles = [];
        }
    }

    /**
     * Loops as long as there are pending files in the OCR queue.
     */
    public async loopForStatus(): Promise<void> {
        try {
            // TODO: add check if already active (avoid multiple loops when pressed process multiple times)
            this.status = await this.httpService.checkStatus();
            if (this.status.failed > 0) {
                // tslint:disable-next-line:max-line-length
                this.view.displayError(n('ocr', 'OCR processing for %n file failed. For details please go to your personal settings.', 'OCR processing for %n files failed. For details please go to your personal settings.', this.status.failed));
            }
            if (this.status.pending > 0) {
                if (this.status.processed > 0) { this.updateFileList(); }
                this.togglePendingState(false);
                setTimeout(this.jquery.proxy(this.loopForStatus, this), 4500);
            } else {
                if (this.status.processed > 0) { this.updateFileList(); }
                this.togglePendingState(false);
            }
        } catch (e) {
            this.view.displayError(`${t('ocr', 'OCR status could not be retrieved:')} ${e.message}`); // TODO: message and error handling
            setTimeout(this.jquery.proxy(this.loopForStatus, this), 4500);
        }
    }

    /**
     * Reloads the OCA.Files.App.fileList.
     */
    private updateFileList(): void {
        this.ocaService.reloadFilelist();
        this.toggleSelectedFilesActionButton();
    }

    /**
     * Trigger the pending notification for the first time (with initialcount)
     * or after that without initialcount.
     * @param force If new files in queue or already in the regular loop.
     * @param initialcount How much files initially to process (number or undefined as the param is optional).
     */
    private togglePendingState(force: boolean, initialcount?: number) {
        this.view.togglePendingNotification(force, initialcount !== undefined ? initialcount : this.status.pending);
    }

    /**
     * Triggers the view to hide the selected files action button in the top bar
     * and empties the selectedFiles array.
     */
    private hideSelectedFilesActionButton(): void {
        this.view.toggleSelectedFilesActionButton(false);
        this.selectedFiles = [];
    }

    /**
     * Retrieves the available languages for the OCR process.
     */
    private async loadLanguages(): Promise<void> {
        try {
            const response: ILanguageResponse = await this.httpService.loadAvailableLanguages();
            const languages: string[] = response.languages.split(';');
            if (languages.length === 0) {
                throw new Error(t('ocr', 'No languages available for OCR processing. Please make sure to configure the languages in the administration section.'));
            }
            this.availableLanguages = languages;
        } catch (e) {
            this.view.displayError(`${t('ocr', 'Available languages could not be retrieved:')} ${e.message}`);
        }
    }
}

interface ILanguageResponse {
    languages: string;
}

interface IRedisResponse {
    set: boolean;
}
