// General imports
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { createSandbox, SinonStub, match } from 'sinon';
import { RequestError } from '../../../src/errors/RequestError';
import { OCNotification } from '../../../src/global-types';
import { ValidationError } from '../../../src/errors/ValidationError';
// Stubbing
import { HttpService } from '../../../src/admin/HttpService';
import { Util } from '../../../src/admin/Util';
import { JSDOM } from 'jsdom';
// Class under test
import { Controller } from '../../../src/admin/Controller';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;
const sb = createSandbox();

describe('Controller', () => {
    let cut: Controller;
    let httpService: HttpService;
    let util: Util;
    let ocNotification: OCNotification;
    const jQuery: Partial<JQueryStatic> = {};
    const jQueryXHR: Partial<JQueryXHR> = {};
    let document: Document;
    let languagesButton: HTMLButtonElement;
    let redisButton: HTMLButtonElement;

    beforeEach(() => {
        httpService = sb.createStubInstance(HttpService);
        util = sb.createStubInstance(Util);
        ocNotification = { showHtml: sb.stub().throws(new Error('Stub was not called with expected arguments.')), hide: sb.stub().throws(new Error('Stub was not called with expected arguments.')) };
        document = new JSDOM().window.document;
        sb.stub(document, 'addEventListener');
        sb.stub(document, 'getElementById').throws(new Error('Stub was not called with expected arguments.'));
        languagesButton = {} as  HTMLButtonElement;
        redisButton = {} as  HTMLButtonElement;
        (document.getElementById as SinonStub).withArgs('languages_apply').returns(languagesButton);
        (document.getElementById as SinonStub).withArgs('redis_apply').returns(redisButton);
        cut = new Controller(httpService, util, ocNotification, (jQuery as JQueryStatic), document);
    });

    afterEach(() => {
        expect(document.addEventListener).to.be.calledWith('click', match.func);
        sb.restore();
    });

    describe('#saveLanguages()', () => {
        let lanugagesInput: HTMLInputElement;

        beforeEach(() => {
            lanugagesInput = {} as HTMLInputElement;
        });

        it('GIVEN a valid value in language input, WHEN saveLanguages() is executed, THEN the Promise is fulfilled.', async () => {
            lanugagesInput.value = 'deu';
            (document.getElementById as SinonStub).withArgs('languages').returns(lanugagesInput);
            (util.checkLanguagesValidity as SinonStub).withArgs(lanugagesInput.value).returns(undefined);
            (httpService.sendLanguages as SinonStub).withArgs(lanugagesInput.value).resolves(jQueryXHR);
            (ocNotification.showHtml as SinonStub).withArgs('<div>OCR: Saved.</div>', match.hasOwn('timeout', 5)).returns(undefined);

            const result = cut.saveLanguages();

            await expect(result).to.be.fulfilled;
        });

        it('GIVEN a valid value in language input, WHEN saveLanguages() is executed AND sendLanguages() is rejected with RequestError, THEN the Promise is fulfilled.', async () => {
            lanugagesInput.value = 'deu';
            (document.getElementById as SinonStub).withArgs('languages').returns(lanugagesInput);
            (util.checkLanguagesValidity as SinonStub).withArgs(lanugagesInput.value).returns(undefined);
            const requestError = new RequestError(503, 'Service unavailable');
            (httpService.sendLanguages as SinonStub).withArgs(lanugagesInput.value).rejects(requestError);
            (ocNotification.showHtml as SinonStub).withArgs(`<div>OCR: Saving languages failed: ${requestError.message}</div>`, match.hasOwn('timeout', 10).and(match.hasOwn('type', 'error'))).returns(undefined);

            const result = cut.saveLanguages();

            await expect(result).to.be.fulfilled;
        });

        it('GIVEN an invalid value in language input, WHEN saveLanguages() is executed AND checkLanguagesValidity() throws ValidationError, THEN the Promise is fulfilled.', async () => {
            lanugagesInput.value = 'deu';
            (document.getElementById as SinonStub).withArgs('languages').returns(lanugagesInput);
            const validationError = new ValidationError('Invalid');
            (util.checkLanguagesValidity as SinonStub).withArgs(lanugagesInput.value).throws(validationError);
            (ocNotification.showHtml as SinonStub).withArgs(`<div>OCR: ${validationError.message}</div>`, match.hasOwn('timeout', 10).and(match.hasOwn('type', 'error'))).returns(undefined);

            const result = cut.saveLanguages();

            await expect(result).to.be.fulfilled;
        });

        it('GIVEN no language input, WHEN saveLanguages() is executed, THEN the Promise is rejectedWith TypeError.', async () => {
            (document.getElementById as SinonStub).withArgs('languages').returns(null);

            const result = cut.saveLanguages();

            await expect(result).to.be.rejectedWith(TypeError);
        });
    });

    describe('#saveRedis()', () => {
        let redisHostInput: HTMLInputElement;
        let redisPortInput: HTMLInputElement;
        let redisDbInput: HTMLInputElement;
        let redisPasswordInput: HTMLInputElement;

        beforeEach(() => {
            redisHostInput = {} as HTMLInputElement;
            redisPortInput = {} as HTMLInputElement;
            redisDbInput = {} as HTMLInputElement;
            redisPasswordInput = {} as HTMLInputElement;
        });

        it('GIVEN valid values in redis inputs, WHEN saveRedis() is executed, THEN the Promise is fulfilled.', async () => {
            redisHostInput.value = 'localhost';
            redisPortInput.value = '6379';
            redisDbInput.value = '0';
            redisPasswordInput.value = 'pw';
            (document.getElementById as SinonStub).withArgs('redisHost').returns(redisHostInput);
            (document.getElementById as SinonStub).withArgs('redisPort').returns(redisPortInput);
            (document.getElementById as SinonStub).withArgs('redisDb').returns(redisDbInput);
            (document.getElementById as SinonStub).withArgs('redisPassword').returns(redisPasswordInput);
            (util.checkRedisHostValidity as SinonStub).withArgs(redisHostInput.value).returns(undefined);
            (util.checkRedisPortValidity as SinonStub).withArgs(6379).returns(undefined);
            (util.checkRedisDbValidity as SinonStub).withArgs(0).returns(undefined);
            (httpService.sendRedis as SinonStub).withArgs(redisHostInput.value, redisPortInput.value, redisDbInput.value, redisPasswordInput.value).resolves(jQueryXHR);
            (ocNotification.showHtml as SinonStub).withArgs('<div>OCR: Saved.</div>', match.hasOwn('timeout', 5)).returns(undefined);

            const result = cut.saveRedis();

            await expect(result).to.be.fulfilled;
        });

        it('GIVEN valid values in redis inputs, WHEN saveRedis() is executed AND sendRedis() is rejected with RequestError, THEN the Promise is fulfilled.', async () => {
            redisHostInput.value = 'localhost';
            redisPortInput.value = '6379';
            redisDbInput.value = '0';
            redisPasswordInput.value = 'pw';
            (document.getElementById as SinonStub).withArgs('redisHost').returns(redisHostInput);
            (document.getElementById as SinonStub).withArgs('redisPort').returns(redisPortInput);
            (document.getElementById as SinonStub).withArgs('redisDb').returns(redisDbInput);
            (document.getElementById as SinonStub).withArgs('redisPassword').returns(redisPasswordInput);
            (util.checkRedisHostValidity as SinonStub).withArgs(redisHostInput.value).returns(undefined);
            (util.checkRedisPortValidity as SinonStub).withArgs(6379).returns(undefined);
            (util.checkRedisDbValidity as SinonStub).withArgs(0).returns(undefined);
            const requestError = new RequestError(503, 'Service unavailable');
            (httpService.sendRedis as SinonStub).withArgs(redisHostInput.value, redisPortInput.value, redisDbInput.value, redisPasswordInput.value).rejects(requestError);
            (ocNotification.showHtml as SinonStub).withArgs(`<div>OCR: Saving Redis settings failed: ${requestError.message}</div>`, match.hasOwn('timeout', 10).and(match.hasOwn('type', 'error'))).returns(undefined);

            const result = cut.saveRedis();

            await expect(result).to.be.fulfilled;
        });

        it('GIVEN an invalid value for redisDb in redis inputs, WHEN saveRedis() is executed AND checkRedisDbValidity() is rejected with ValidationError, THEN the Promise is fulfilled.', async () => {
            redisHostInput.value = 'localhost';
            redisPortInput.value = '6379';
            redisDbInput.value = '0';
            redisPasswordInput.value = 'pw';
            (document.getElementById as SinonStub).withArgs('redisHost').returns(redisHostInput);
            (document.getElementById as SinonStub).withArgs('redisPort').returns(redisPortInput);
            (document.getElementById as SinonStub).withArgs('redisDb').returns(redisDbInput);
            (document.getElementById as SinonStub).withArgs('redisPassword').returns(redisPasswordInput);
            (util.checkRedisHostValidity as SinonStub).withArgs(redisHostInput.value).returns(undefined);
            (util.checkRedisPortValidity as SinonStub).withArgs(6379).returns(undefined);
            const validationError = new ValidationError('Invalid');
            (util.checkRedisDbValidity as SinonStub).withArgs(0).throws(validationError);
            (ocNotification.showHtml as SinonStub).withArgs(`<div>OCR: ${validationError.message}</div>`, match.hasOwn('timeout', 10).and(match.hasOwn('type', 'error'))).returns(undefined);

            const result = cut.saveRedis();

            await expect(result).to.be.fulfilled;
        });

        it('GIVEN an invalid value for redisPort in redis inputs, WHEN saveRedis() is executed AND checkRedisPortValidity() is rejected with ValidationError, THEN the Promise is fulfilled.', async () => {
            redisHostInput.value = 'localhost';
            redisPortInput.value = '6379';
            redisDbInput.value = '0';
            redisPasswordInput.value = 'pw';
            (document.getElementById as SinonStub).withArgs('redisHost').returns(redisHostInput);
            (document.getElementById as SinonStub).withArgs('redisPort').returns(redisPortInput);
            (document.getElementById as SinonStub).withArgs('redisDb').returns(redisDbInput);
            (document.getElementById as SinonStub).withArgs('redisPassword').returns(redisPasswordInput);
            (util.checkRedisHostValidity as SinonStub).withArgs(redisHostInput.value).returns(undefined);
            const validationError = new ValidationError('Invalid');
            (util.checkRedisPortValidity as SinonStub).withArgs(6379).throws(validationError);
            (ocNotification.showHtml as SinonStub).withArgs(`<div>OCR: ${validationError.message}</div>`, match.hasOwn('timeout', 10).and(match.hasOwn('type', 'error'))).returns(undefined);

            const result = cut.saveRedis();

            await expect(result).to.be.fulfilled;
        });

        it('GIVEN an invalid value for redisHost in redis inputs, WHEN saveRedis() is executed AND checkRedisHostValidity() is rejected with ValidationError, THEN the Promise is fulfilled.', async () => {
            redisHostInput.value = 'localhost';
            redisPortInput.value = '6379';
            redisDbInput.value = '0';
            redisPasswordInput.value = 'pw';
            (document.getElementById as SinonStub).withArgs('redisHost').returns(redisHostInput);
            (document.getElementById as SinonStub).withArgs('redisPort').returns(redisPortInput);
            (document.getElementById as SinonStub).withArgs('redisDb').returns(redisDbInput);
            (document.getElementById as SinonStub).withArgs('redisPassword').returns(redisPasswordInput);
            const validationError = new ValidationError('Invalid');
            (util.checkRedisHostValidity as SinonStub).withArgs(redisHostInput.value).throws(validationError);
            (ocNotification.showHtml as SinonStub).withArgs(`<div>OCR: ${validationError.message}</div>`, match.hasOwn('timeout', 10).and(match.hasOwn('type', 'error'))).returns(undefined);

            const result = cut.saveRedis();

            await expect(result).to.be.fulfilled;
        });

        it('GIVEN no redisHost input, WHEN saveRedis() is executed, THEN the Promise is rejectedWith TypeError.', async () => {
            (document.getElementById as SinonStub).withArgs('redisHost').returns(null);

            const result = cut.saveRedis();

            await expect(result).to.be.rejectedWith(TypeError);
        });

        it('GIVEN no redisDb input, WHEN saveRedis() is executed, THEN the Promise is rejectedWith TypeError.', async () => {
            redisHostInput.value = 'localhost';
            (document.getElementById as SinonStub).withArgs('redisHost').returns(redisHostInput);
            (document.getElementById as SinonStub).withArgs('redisPort').returns(null);

            const result = cut.saveRedis();

            await expect(result).to.be.rejectedWith(TypeError);
        });

        it('GIVEN no redisDb input, WHEN saveRedis() is executed, THEN the Promise is rejectedWith TypeError.', async () => {
            redisHostInput.value = 'localhost';
            redisPortInput.value = '6379';
            (document.getElementById as SinonStub).withArgs('redisHost').returns(redisHostInput);
            (document.getElementById as SinonStub).withArgs('redisPort').returns(redisPortInput);
            (document.getElementById as SinonStub).withArgs('redisDb').returns(null);

            const result = cut.saveRedis();

            await expect(result).to.be.rejectedWith(TypeError);
        });

        it('GIVEN no redisDb input, WHEN saveRedis() is executed, THEN the Promise is rejectedWith TypeError.', async () => {
            redisHostInput.value = 'localhost';
            redisPortInput.value = '6379';
            redisDbInput.value = '0';
            (document.getElementById as SinonStub).withArgs('redisHost').returns(redisHostInput);
            (document.getElementById as SinonStub).withArgs('redisPort').returns(redisPortInput);
            (document.getElementById as SinonStub).withArgs('redisDb').returns(redisDbInput);
            (document.getElementById as SinonStub).withArgs('redisPassword').returns(null);

            const result = cut.saveRedis();

            await expect(result).to.be.rejectedWith(TypeError);
        });
    });
});
