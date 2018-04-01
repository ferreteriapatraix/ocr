import { OC } from '../global-types';

/**
 * Config
 */
export class Configuration {

    public languagesSettingsEndpoint: string;
    public redisSettingsEndpoint: string;

    constructor(oc: OC) {
         this.languagesSettingsEndpoint = oc.generateUrl('/apps/ocr/admin/languages');
         this.redisSettingsEndpoint = oc.generateUrl('/apps/ocr/admin/redis');
    }
}
