import { UnderscoreStatic } from 'underscore';
import { OC, OCA } from '../global-types';
import { Configuration } from './Configuration';
import { Controller } from './Controller';
import { HttpService } from './HttpService';
import { OcaService } from './OcaService';
import { Util } from './Util';
import { View } from './View';

/**
 * The main app.
 */
export class App {

    private config: Configuration;
    private util: Util;
    private view: View;
    private httpService: HttpService;
    private ocaService: OcaService;
    private controller: Controller;

    constructor(document: Document, jquery: JQueryStatic, underscore: UnderscoreStatic, OC: OC, OCA: OCA) {
        this.config = new Configuration(OC);
        this.util = new Util();
        this.view = new View(document, jquery, OC.Notification);
        this.httpService = new HttpService(jquery, this.config, this.util);
        this.ocaService = new OcaService(underscore, OC, OCA);
        this.controller = new Controller(document, $, this.util, this.view, this.httpService, this.ocaService);
    }
}
