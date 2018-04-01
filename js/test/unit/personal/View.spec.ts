// General imports
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { createSandbox, SinonStub, match } from 'sinon';
import { RequestError } from '../../../src/errors/RequestError';
import { OCNotification } from '../../../src/global-types';
import { IJob } from '../../../src/personal/poto/Job';
// Stubbing
import { JSDOM } from 'jsdom';
// Class under test
import { View } from '../../../src/personal/View';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;
const sb = createSandbox();

describe('View', () => {
    let cut: View;
    let ocNotification: OCNotification;
    let jQuery: any;
    const jQueryAppend: any = {};
    const jQueryXHR: Partial<JQueryXHR> = {};
    let document: Document;
    let ocrSettingsElement: Element;
    let handlebarsTableTemplate: HandlebarsTemplateDelegate;

    beforeEach(() => {
        handlebarsTableTemplate = sb.stub().throws(new Error('Stub was not called with expected arguments.'));
        ocNotification = { showHtml: sb.stub().throws(new Error('Stub was not called with expected arguments.')), hide: sb.stub().throws(new Error('Stub was not called with expected arguments.')) };
        document = new JSDOM().window.document;
        sb.stub(document, 'getElementById').throws(new Error('Stub was not called with expected arguments.'));
        ocrSettingsElement = {} as Element;
        (document.getElementById as SinonStub).withArgs('ocr-settings').returns(ocrSettingsElement);
        jQuery = sb.stub().throws(new Error('Stub was not called with expected arguments.'));
        jQueryAppend.appendTo = sb.stub().throws(new Error('Stub was not called with expected arguments.'));
        cut = new View(document, (jQuery as JQueryStatic), ocNotification, handlebarsTableTemplate);
    });

    afterEach(() => {
        sb.restore();
    });

    describe('#displayMessage()', () => {
        const message = 'some message';

        it(`GIVEN the message = ${message} AND error = false, WHEN displayMessage() is executed, THEN the Function returns.`, () => {
            (ocNotification.showHtml as SinonStub).withArgs(`<div>OCR: ${message}</div>`, match.hasOwn('timeout', 10)).returns(undefined);

            const result = cut.displayMessage(message, false);
        });

        it(`GIVEN the message = ${message} AND error = true, WHEN displayMessage() is executed, THEN the Function returns.`, () => {
            (ocNotification.showHtml as SinonStub).withArgs(`<div>OCR: ${message}</div>`, match.hasOwn('timeout', 10).and(match.hasOwn('type', 'error'))).returns(undefined);

            const result = cut.displayMessage(message, true);
        });
    });

    describe('#render()', () => {
        const job1: IJob = { id: 1, status: 'FAILED', originalFilename: 'file.jpeg', errorLog: 'Failure', replace: '1' };
        const job2: IJob = { id: 1, status: 'FAILED', originalFilename: 'file.jpeg', errorLog: 'Failure', replace: '0' };
        const jobs: IJob[] = [job1, job2];
        const html = '<table></table>';

        it(`GIVEN a jobs array = ${JSON.stringify(jobs)}, WHEN render() is executed, THEN the Function returns and appends the rendered template to the html.`, () => {
            const expectedJob1: any = { ...job1 };
            expectedJob1.replace = true;
            const expectedJob2: any = { ...job2 };
            expectedJob2.replace = false;
            const jobMatch = match((value: any) => {
                try {
                    expect(value).to.be.deep.equal([expectedJob1, expectedJob2]);
                    return true;
                } catch (e) {
                    return false;
                }
            });
            const templateMatch = match.hasOwn('deleteText', 'Delete').and(match.hasOwn('enabled', true)).and(match.hasOwn('jobs', jobMatch))
                .and(match.hasOwn('noPendingOrFailedText', 'No pending or failed OCR items found.'))
                .and(match.hasOwn('refreshButtonText', 'Refresh'))
                .and(match.hasOwn('tableHeadDeleteFromQueueText', 'Delete from queue'))
                .and(match.hasOwn('tableHeadFileText', 'File'))
                .and(match.hasOwn('tableHeadJobText', 'Status'))
                .and(match.hasOwn('tableHeadLogText', 'Log'))
                .and(match.hasOwn('tableHeadReplaceText', 'Replace by result'));
            (handlebarsTableTemplate as SinonStub).withArgs(templateMatch).returns(html);
            (jQuery as SinonStub).withArgs(html).returns(jQueryAppend);
            (jQueryAppend.appendTo as SinonStub).withArgs(ocrSettingsElement).returns(undefined);

            const result = cut.render(jobs);
        });

        it('GIVEN an empty jobs array = [], WHEN render() is executed, THEN the Function returns and appends the rendered template (disabled) to the html.', () => {
            const templateMatch = match.hasOwn('deleteText', 'Delete').and(match.hasOwn('enabled', false)).and(match.hasOwn('jobs', match.array.deepEquals([])))
                .and(match.hasOwn('noPendingOrFailedText', 'No pending or failed OCR items found.'))
                .and(match.hasOwn('refreshButtonText', 'Refresh'))
                .and(match.hasOwn('tableHeadDeleteFromQueueText', 'Delete from queue'))
                .and(match.hasOwn('tableHeadFileText', 'File'))
                .and(match.hasOwn('tableHeadJobText', 'Status'))
                .and(match.hasOwn('tableHeadLogText', 'Log'))
                .and(match.hasOwn('tableHeadReplaceText', 'Replace by result'));
            (handlebarsTableTemplate as SinonStub).withArgs(templateMatch).returns(html);
            (jQuery as SinonStub).withArgs(html).returns(jQueryAppend);
            (jQueryAppend.appendTo as SinonStub).withArgs(ocrSettingsElement).returns(undefined);

            const result = cut.render([]);
        });
    });

    describe('#destroy()', () => {
        it('WHEN destroy() is executed, THEN the Function returns and destroys the html.', () => {

            const result = cut.destroy();

            expect(ocrSettingsElement.innerHTML).to.be.equal('');
        });

        it('WHEN destroy() is executed AND getElementById returned null, THEN the Function returns and doesn\'t destroy any html.', () => {
            (document.getElementById as SinonStub).withArgs('ocr-settings').returns(null);
            const separateCut = new View(document, (jQuery as JQueryStatic), ocNotification, handlebarsTableTemplate);

            const result = separateCut.destroy();

            expect(ocrSettingsElement.innerHTML).to.be.undefined;
        });
    });
});
