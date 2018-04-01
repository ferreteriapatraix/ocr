// General imports
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { createSandbox, SinonStub, match } from 'sinon';
import { RequestError } from '../../../src/errors/RequestError';
// Stubbing
import { Configuration } from '../../../src/personal/Configuration';
// Class under test
import { HttpService } from '../../../src/personal/HttpService';

chai.use(chaiAsPromised);
const expect = chai.expect;
const sb = createSandbox();

describe('HttpService', () => {
    let cut: HttpService;
    let configStub: Configuration;
    const jQuery: Partial<JQueryStatic> = {};
    const jQueryXHR: Partial<JQueryXHR> = {};
    const jQueryXHRError: Partial<JQueryXHR> = {
        responseJSON: 'failure',
        status: 400,
    };

    beforeEach(() => {
        configStub = sb.createStubInstance(Configuration);
        configStub.jobEndpoint = 'jobEndpoint';
        jQuery.ajax = sb.stub().rejects(new Error('Stub was not called with expected arguments.'));
        cut = new HttpService((jQuery as JQueryStatic), configStub);
    });

    afterEach(() => {
        sb.restore();
    });

    describe('#getAllJobs()', () => {
        it('WHEN getAllJobs() is executed, THEN the Promise is resolved with the jQuery XHR response.', async () => {
            const optionsMatch = match.hasOwn('method', 'GET').and(match.hasOwn('url', configStub.jobEndpoint));
            (jQuery.ajax as SinonStub).withArgs(optionsMatch).resolves(jQueryXHR);

            const result = cut.getAllJobs();

            await expect(result).to.be.eventually.equal(jQueryXHR);
        });

        it('WHEN getAllJobs() is executed AND ajax rejects with status 400, THEN the Promise is rejected with the jQuery XHR response.', async () => {
            const optionsMatch = match.hasOwn('method', 'GET').and(match.hasOwn('url', configStub.jobEndpoint));
            (jQuery.ajax as SinonStub).withArgs(optionsMatch).rejects(jQueryXHRError);

            const result = cut.getAllJobs();

            await expect(result).to.be.rejectedWith(RequestError, jQueryXHRError.responseJSON);
        });
    });

    describe('#deleteJob()', () => {
        const id = 1;

        it(`GIVEN the id = ${id},WHEN deleteJob() is executed, THEN the Promise is resolved with the jQuery XHR response.`, async () => {
            const optionsMatch = match.hasOwn('method', 'DELETE').and(match.hasOwn('url', configStub.jobEndpoint));
            (jQuery.ajax as SinonStub).withArgs(optionsMatch).resolves(jQueryXHR);

            const result = cut.deleteJob(id);

            await expect(result).to.be.eventually.equal(jQueryXHR);
        });

        it(`GIVEN the id = ${id},WHEN deleteJob() is executed AND ajax rejects with status 400, THEN the Promise is rejected with the jQuery XHR response.`, async () => {
            const optionsMatch = match.hasOwn('method', 'DELETE').and(match.hasOwn('url', configStub.jobEndpoint));
            (jQuery.ajax as SinonStub).withArgs(optionsMatch).rejects(jQueryXHRError);

            const result = cut.deleteJob(id);

            await expect(result).to.be.rejectedWith(RequestError, jQueryXHRError.responseJSON);
        });
    });
});
