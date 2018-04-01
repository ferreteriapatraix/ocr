// General imports
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { createSandbox, SinonStub, match } from 'sinon';
import { RequestError } from '../../../src/errors/RequestError';
// Stubbing
import { Configuration } from '../../../src/admin/Configuration';
// Class under test
import { HttpService } from '../../../src/admin/HttpService';

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
        configStub.languagesSettingsEndpoint = 'languagesSettingsEndpoint';
        configStub.redisSettingsEndpoint = 'redisSettingsEndpoint';
        jQuery.ajax = sb.stub().rejects(new Error('Stub was not called with expected arguments.'));
        cut = new HttpService((jQuery as JQueryStatic), configStub);
    });

    afterEach(() => {
        sb.restore();
    });

    describe('#sendLanguages()', () => {
        it('GIVEN languages, WHEN sendLanguages() is executed, THEN the Promise is resolved with the jQuery XHR response.', async () => {
            const languages = 'deu';
            const optionsMatch = match.hasOwn('data', match.hasOwn('languages', languages)).and(match.hasOwn('method', 'POST')).and(match.hasOwn('url', configStub.languagesSettingsEndpoint));
            (jQuery.ajax as SinonStub).withArgs(optionsMatch).resolves(jQueryXHR);

            const result = cut.sendLanguages(languages);

            await expect(result).to.be.eventually.equal(jQueryXHR);
        });

        it('GIVEN languages, WHEN sendLanguages() is executed AND ajax rejects with status 400, THEN the Promise is rejected with the jQuery XHR response.', async () => {
            const languages = 'deu';
            const optionsMatch = match.hasOwn('data', match.hasOwn('languages', languages)).and(match.hasOwn('method', 'POST')).and(match.hasOwn('url', configStub.languagesSettingsEndpoint));
            (jQuery.ajax as SinonStub).withArgs(optionsMatch).rejects(jQueryXHRError);

            const result = cut.sendLanguages(languages);

            await expect(result).to.be.rejectedWith(RequestError, jQueryXHRError.responseJSON);
        });
    });

    describe('#sendRedis()', () => {
        it('GIVEN redisHost, redisPort, redisDB and redisPassword, WHEN sendRedis() is executed, THEN the Promise is resolved with the jQuery XHR response.', async () => {
            const redisHost = '127.0.0.1';
            const redisDb = '0';
            const redisPort = '6379';
            const redisPassword = 'pw';
            const optionsMatch = match.hasOwn('data',
                match.hasOwn('redisHost', redisHost).and(match.hasOwn('redisDb', redisDb)).and(match.hasOwn('redisPort', redisPort)).and(match.hasOwn('redisPassword', redisPassword)))
                .and(match.hasOwn('method', 'POST')).and(match.hasOwn('url', configStub.redisSettingsEndpoint));
            (jQuery.ajax as SinonStub).withArgs(optionsMatch).resolves(jQueryXHR);

            const result = cut.sendRedis(redisHost, redisPort, redisDb, redisPassword);

            await expect(result).to.be.eventually.equal(jQueryXHR);
        });

        it('GIVEN redisHost, redisPort, redisDB and redisPassword, WHEN sendRedis() is executed AND ajax rejects with status 400, THEN the Promise is rejected with the jQuery XHR response.', async () => {
            const redisHost = '127.0.0.1';
            const redisDb = '0';
            const redisPort = '6379';
            const redisPassword = 'pw';
            const optionsMatch = match.hasOwn('data',
                match.hasOwn('redisHost', redisHost).and(match.hasOwn('redisDb', redisDb)).and(match.hasOwn('redisPort', redisPort)).and(match.hasOwn('redisPassword', redisPassword)))
                .and(match.hasOwn('method', 'POST')).and(match.hasOwn('url', configStub.redisSettingsEndpoint));
            (jQuery.ajax as SinonStub).withArgs(optionsMatch).rejects(jQueryXHRError);

            const result = cut.sendRedis(redisHost, redisPort, redisDb, redisPassword);

            await expect(result).to.be.rejectedWith(RequestError, jQueryXHRError.responseJSON);
        });
    });
});
