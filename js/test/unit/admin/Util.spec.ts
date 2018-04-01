// General imports
import * as chai from 'chai';
import { ValidationError } from '../../../src/errors/ValidationError';
// Class under test
import { Util } from '../../../src/admin/Util';

const expect = chai.expect;

describe('Util', () => {
    let cut: Util;

    beforeEach(() => {
        cut = new Util();
    });

    describe('#checkLanguagesValidity()', () => {
        it('GIVEN languages = "eng", WHEN checkLanguagesValidity() is executed, THEN it is returned.', () => {
            const languages = 'eng';

            const result = cut.checkLanguagesValidity(languages);

            expect(result).to.not.throw;
        });

        it('GIVEN languages = "eng-frak", WHEN checkLanguagesValidity() is executed, THEN it is returned.', () => {
            const languages = 'eng-frak';

            const result = cut.checkLanguagesValidity(languages);

            expect(result).to.not.throw;
        });

        it('GIVEN languages = "eng;deu", WHEN checkLanguagesValidity() is executed, THEN it is returned.', () => {
            const languages = 'eng;deu';

            const result = cut.checkLanguagesValidity(languages);

            expect(result).to.not.throw;
        });

        it('GIVEN languages = "eng-frak;deu-frak", WHEN checkLanguagesValidity() is executed, THEN it is returned.', () => {
            const languages = 'eng-frak;deu-frak';

            const result = cut.checkLanguagesValidity(languages);

            expect(result).to.not.throw;
        });

        it('GIVEN languages = "eng;deu-frak;spa", WHEN checkLanguagesValidity() is executed, THEN it is returned.', () => {
            const languages = 'eng;deu-frak;spa';

            const result = cut.checkLanguagesValidity(languages);

            expect(result).to.not.throw;
        });

        it('GIVEN languages = "Latin;script/Latin;deu;deu-frak;eng_frak", WHEN checkLanguagesValidity() is executed, THEN it is returned.', () => {
            const languages = 'Latin;script/Latin;deu;deu-frak;eng_frak';

            const result = cut.checkLanguagesValidity(languages);

            expect(result).to.not.throw;
        });

        it('GIVEN languages = "english", WHEN checkLanguagesValidity() is executed, THEN it is returned.', () => {
            const languages = 'english';

            const result = cut.checkLanguagesValidity(languages);

            expect(result).to.not.throw;
        });

        it('GIVEN languages = "eng;deu;", WHEN checkLanguagesValidity() is executed, THEN ValidationError is thrown.', () => {
            const languages = 'eng;deu;';

            expect(() => cut.checkLanguagesValidity(languages)).to.throw(ValidationError, 'The given languages are not specified in the correct format.');
        });
    });

    describe('#checkRedisHostValidity()', () => {
        it('GIVEN redisHost = "127.0.0.1", WHEN checkRedisHostValidity() is executed, THEN it is returned.', () => {
            const redisHost = '127.0.0.1';

            const result = cut.checkRedisHostValidity(redisHost);

            expect(result).to.not.throw;
        });

        it('GIVEN redisHost = "localhost", WHEN checkRedisHostValidity() is executed, THEN it is returned.', () => {
            const redisHost = 'localhost';

            const result = cut.checkRedisHostValidity(redisHost);

            expect(result).to.not.throw;
        });

        it('GIVEN redisHost = "test:8080", WHEN checkRedisHostValidity() is executed, THEN it ValidationError is thrown.', () => {
            const redisHost = 'test:8080';

            expect(() => cut.checkRedisHostValidity(redisHost)).to.throw(ValidationError, 'The given Redis host is not specified in the correct format.');
        });

        it('GIVEN redisHost = "http://test", WHEN checkRedisHostValidity() is executed, THEN ValidationError is thrown.', () => {
            const redisHost = 'http://test';

            expect(() => cut.checkRedisHostValidity(redisHost)).to.throw(ValidationError, 'The given Redis host is not specified in the correct format.');
        });
    });

    describe('#checkRedisPortValidity()', () => {
        it('GIVEN redisPort = 6379, WHEN checkRedisPortValidity() is executed, THEN it is returned.', () => {
            const redisPort = 6379;

            const result = cut.checkRedisPortValidity(redisPort);

            expect(result).to.not.throw;
        });

        it('GIVEN redisPort = 65536, WHEN checkRedisPortValidity() is executed, THEN ValidationError is thrown.', () => {
            const redisPort = 65536;

            expect(() => cut.checkRedisPortValidity(redisPort)).to.throw(ValidationError, 'The given Redis port is not specified in the correct format.');
        });

        it('GIVEN redisPort = -1, WHEN checkRedisPortValidity() is executed, THEN ValidationError is thrown.', () => {
            const redisPort = -1;

            expect(() => cut.checkRedisPortValidity(redisPort)).to.throw(ValidationError, 'The given Redis port is not specified in the correct format.');
        });
    });

    describe('#checkRedisDbValidity()', () => {
        it('GIVEN redisDb = 0, WHEN checkRedisDbValidity() is executed, THEN it is returned.', () => {
            const redisDb = 0;

            const result = cut.checkRedisDbValidity(redisDb);

            expect(result).to.not.throw;
        });

        it('GIVEN redisDb = 1, WHEN checkRedisDbValidity() is executed, THEN it is returned.', () => {
            const redisDb = 1;

            const result = cut.checkRedisDbValidity(redisDb);

            expect(result).to.not.throw;
        });

        it('GIVEN redisDb = -1, WHEN checkRedisDbValidity() is executed, THEN ValidationError is thrown.', () => {
            const redisDb = -1;

            expect(() => cut.checkRedisDbValidity(redisDb)).to.throw(ValidationError, 'The given Redis database is not specified in the correct format.');
        });
    });
});
