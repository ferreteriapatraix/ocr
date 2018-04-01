import { OC } from '../global-types';
import { Configuration } from './Configuration';
import { Controller } from './Controller';
import { HttpService } from './HttpService';
import { Util } from './Util';

/**
 * Admin
 */
export class Admin {

    private httpService: HttpService;
    private controller: Controller;
    private util: Util;
    private configuration: Configuration;

    constructor(document: Document, jquery: JQueryStatic, OC: OC) {
        this.util = new Util();
        this.configuration = new Configuration(OC);
        this.httpService = new HttpService(jquery, this.configuration);
        this.controller = new Controller(this.httpService, this.util, OC.Notification, jquery, document);
    }
}
