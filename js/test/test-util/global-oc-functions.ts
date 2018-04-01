import { ISingleTranslation, IMultiTranslation } from '../../src/global-types';

before(() => {
    const globalVar: any = global;
    const t: ISingleTranslation = (appName: string, translationString: string) => translationString;
    const n: IMultiTranslation = (appName: string, translationString: string, multiTranslationString: string, count: number) => multiTranslationString;
    globalVar.t = t;
    globalVar.n = n;
});
