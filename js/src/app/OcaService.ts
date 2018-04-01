import { UnderscoreStatic } from 'underscore';
import { IMultiTranslation, ISingleTranslation, OC, OCA } from '../global-types';
import { File, IFile } from './poto/File';

declare var t: ISingleTranslation;
declare var n: IMultiTranslation;

/**
 * OCA util service.
 */
export class OcaService {

    constructor(private underscore: UnderscoreStatic, private oc: OC, private oca: OCA) { }

    /**
     * Destroy the OCR related FileActions.
     */
    public destroy(): void {
        this.oca.Files.fileActions.clear();
        this.oca.Files.fileActions.registerDefaultActions();
    }

    /**
     * Binds the instances selectedFilesActionButton to the events of the FileList
     * of the this.oca.Files app.
     * @param instance The instance that the events should be bound to (this).
     */
    public registerCheckBoxEvents(instance: any): void {
        this.oca.Files.App.fileList.$fileList.on('change', 'td.selection>.selectCheckBox', this.underscore.bind(instance.toggleSelectedFilesActionButton, instance));
        // backwards compatible to nc12:
        this.oca.Files.App.fileList.$fileList.on('change', 'td.filename>.selectCheckBox', this.underscore.bind(instance.toggleSelectedFilesActionButton, instance));

        this.oca.Files.App.fileList.$el.find('.select-all').click(this.underscore.bind(instance.toggleSelectedFilesActionButton, instance));
        this.oca.Files.App.fileList.$el.find('.delete-selected').click(this.underscore.bind(instance.hideSelectedFilesActionButton, instance));
    }

    /**
     * Retrieves the array of selected files in the FileList of the this.oca.Files app.
     * @returns The array of files that is currently selected.
     */
    public getSelectedFiles(): IFile[] {
        return this.oca.Files.App.fileList.getSelectedFiles();
    }

    /**
     * Reloads the FileList of the this.oca.Files app.
     */
    public reloadFilelist(): void {
        this.oca.Files.App.fileList.reload();
    }

    /**
     * Registers the FileActions at this.oca.Files app.
     */
    public registerFileActions(): void {
        // Register FileAction for MIME type pdf
        this.oca.Files.fileActions.registerAction({
            actionHandler: this.fileActionHandler,
            altText: t('ocr', 'OCR'),
            displayName: t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            mime: 'application/pdf',
            name: 'Ocr',
            order: 100,
            permissions: this.oc.PERMISSION_UPDATE,

        });
        // Register FileAction for MIME type image
        this.oca.Files.fileActions.registerAction({
            actionHandler: this.fileActionHandler,
            altText: t('ocr', 'OCR'),
            displayName: t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            mime: 'image',
            name: 'Ocr',
            order: 100,
            permissions: this.oc.PERMISSION_UPDATE,
        });
    }

    /**
     * Triggers the rendering of the OCR dropdown for a single file action.
     * Acts as the ActionHandler which is registered within the registerFileActions method.
     * @param ocaFilesFileName The file name retrieved by the OCAFiles.fileActions.
     * @param context The context object retrieved by the OCAFiles.fileActions.
     */
    private fileActionHandler(ocaFilesFileName: string, context: any): void {
        const file: IFile = new File();
        file.id = context.$file.attr('data-id');
        file.mimetype = context.fileActions.getCurrentMimeType();
        const files = new Array<IFile>();
        files.push(file);
        // We are in a callback context, therefore we need to call it statically. (As we cannot pass "this")
        this.oca.Ocr.$app.controller.selectedFiles = files;
        this.oca.Ocr.$app.view.renderFileAction(ocaFilesFileName, this.oca.Ocr.$app.controller.availableLanguages);
    }
}
