import { Configuration } from './Configuration';
import { IFile, IReducedFile } from './poto/File';

/**
 * Utility functions.
 */
export class Util {

    /**
     * Filters an array of files for the correct MIME type and
     * returns an array with only supported files.
     * @param files The array of files that should be filtered.
     * @returns The filtered resulting array.
     */
    public filterFilesWithMimeTypes(files: IFile[]): IFile[] {
        if (files === undefined) { return []; }
        return files.filter((file: IFile) => {
            return Configuration.allowedMimetypes.indexOf(file.mimetype) === -1 ? false : true;
        });
    }

    /**
     * Shrinks down the size of the object to the absolutely minimum (id).
     * @param files The array of files that should be shrunk.
     * @returns An array of reduced files.
     */
    public reduceFileArraySize(files: IFile[]): IReducedFile[] {
        return files.map((file: IFile) => {
            return { id: file.id };
        });
    }
}
