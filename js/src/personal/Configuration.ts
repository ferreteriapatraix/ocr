import { OC } from '../global-types';

/**
 * Config
 */
export class Configuration {

    public jobEndpoint: string;

    constructor(oc: OC) {
         this.jobEndpoint = oc.generateUrl('/apps/ocr');
    }
}
