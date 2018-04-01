/**
 * An error for request failures
 */
export class RequestError extends Error {
    constructor(public status: number, public message: any) {
        super(message);
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}
