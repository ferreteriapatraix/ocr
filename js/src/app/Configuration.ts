import { OC } from '../global-types';

/**
 * The config.
 */
export class Configuration {

    public static allowedMimetypes: string[] = ['application/pdf', 'image/png',
        'image/jpeg', 'image/tiff',
        'image/jp2', 'image/jpm',
        'image/jpx', 'image/webp',
        'image/gif'];

    public statusEndpoint: string;
    public jobEndpoint: string;
    public languagesEndpoint: string;
    public redisEvaluationEndpoint: string;

    constructor(oc: OC) {
        this.statusEndpoint = oc.generateUrl('/apps/ocr/status');
        this.jobEndpoint = oc.generateUrl('/apps/ocr');
        this.languagesEndpoint = oc.generateUrl('/apps/ocr/languages');
        this.redisEvaluationEndpoint = oc.generateUrl('/apps/ocr/redis');
    }
}
