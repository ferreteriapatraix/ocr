/**
 * A file.
 */
export class File implements IFile {
    public id: number;
    public mimetype: string;
}

export interface IFile extends IReducedFile {
    mimetype: string;
}

export interface IReducedFile {
    id: number;
}
