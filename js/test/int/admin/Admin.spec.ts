// General imports
import * as chai from 'chai';
import { OCNotification } from '../../../src/global-types';
// Stubbing
import $ from 'jquery';
import { JSDOM } from 'jsdom';
// Class under test
import { Admin } from '../../../src/admin/Admin';

const expect = chai.expect;

describe('Admin', () => {
    describe('initialize the app', () => {

        beforeEach(() => {

        });

        afterEach(() => {

        });

        it('GIVEN jquery, OC.Notification and the document, WHEN constructor() is executed, THEN the app will be initiallized correctly.', () => {
            const ocNotification: OCNotification = {
                showHtml: () => '',
            };
            const document = new JSDOM().window.document;
            const httpService = match.instanceOf(HttpService);
            const util = match.instanceOf(Util);

            const result = new Admin(jQuery, ocNotification, document);

            expect(result).to.be.instanceof(Admin);
            expect(HttpService).to.be.calledWith(jQuery);
            expect(Util).to.be.calledOnce;
            expect(Controller).to.be.calledWith(httpService, util, ocNotification, jQuery, document);
        });
    });
});
