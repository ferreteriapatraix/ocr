import { OC } from '../global-types';
import { Configuration } from './Configuration';
import { Controller } from './Controller';
import { HttpService } from './HttpService';
import * as handlebarsTableTemplate from './templates/status-table.hbs';
import { View } from './View';

/**
 * Personal settings app.
 */
export class Personal {

    private config: Configuration;
    private view: View;
    private httpService: HttpService;
    private controller: Controller;

    constructor(document: Document, jquery: JQueryStatic, OC: OC) {
        this.config = new Configuration(OC);
        this.view = new View(document, jquery, OC.Notification, handlebarsTableTemplate);
        this.httpService = new HttpService(jquery, this.config);
        this.controller = new Controller(document, jquery, this.view, this.httpService);
    }
}
