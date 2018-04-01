export class Job implements IJob {
    public id: number;
    public status: string;
    public originalFilename: string;
    public errorLog: string;
    public replace: string;
}

export interface IJob {
    id: number;
    status: string;
    originalFilename: string;
    errorLog: string;
    replace: string;
}
