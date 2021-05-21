import { Browser } from 'puppeteer';

export interface WhoIsRegistrar {
    name: string;
    baseUrl: string;

    isDomainAvailable(
        browser: Browser,
        domainNameWithTLD: string
    ): Promise<boolean>;
}
