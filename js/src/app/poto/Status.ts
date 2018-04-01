/**
 * The status.
 */
export class Status implements IStatus {
    public pending: number;
    public failed: number;
    public processed: number;
}

export interface IStatus {
    pending: number;
    failed: number;
    processed: number;
}
