import { Browser } from 'puppeteer';

import {
    DomainRegistrar,
    Registrar,
    DomainPrice
} from '.';

export class GoDaddyDomainRegistrar implements DomainRegistrar {
    public properties: Registrar = {
        name: 'GoDaddy',
        baseUrl: '',
        features: []
    };

    public async getDomainPrice(
        browser: Browser,
        domainNameWithTLD: string,
        currency: string): Promise<DomainPrice> {
        throw new Error('Method not implemented.');
    }
}
