import { ValidationError } from '../errors/ValidationError';
import { ISingleTranslation } from '../global-types';

declare var t: ISingleTranslation;

/**
 * Utility functions.
 */
export class Util {
    /**
     * Validates if the given string is in the right format.
     * @param languages The string to validate.
     */
    public checkLanguagesValidity(languages: string): void {
        if (!/^[a-zA-Z\_\-\/]+(\;[a-zA-Z\_\-\/]+)*$/.test(languages)) {
            throw new ValidationError(t('ocr', 'The given languages are not specified in the correct format.'));
        }
    }

    /**
     * Validates if the given string is in the right format.
     * @param redisHost The string to validate.
     */
    public checkRedisHostValidity(redisHost: string): void {
        // tslint:disable-next-line:max-line-length
        if (!/(^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$)/.test(redisHost)) {
            throw new ValidationError(t('ocr', 'The given Redis host is not specified in the correct format.'));
        }
    }

    /**
     * Validates if the given number is in the right format.
     * @param redisPort The number to validate.
     */
    public checkRedisPortValidity(redisPort: number): void {
        if (redisPort <= 0 || redisPort > 65535) {
            throw new ValidationError(t('ocr', 'The given Redis port is not specified in the correct format.'));
        }
    }

    /**
     * Validates if the given number is in the right format.
     * @param redisDb The number to validate.
     */
    public checkRedisDbValidity(redisDb: number): void {
        if (redisDb < 0) {
            throw new ValidationError(t('ocr', 'The given Redis database is not specified in the correct format.'));
        }
    }
}
