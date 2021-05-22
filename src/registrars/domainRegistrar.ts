import { Browser } from 'puppeteer';

export type Registrar = {
    name: string;
    baseUrl: string;
    features: string[];
}

export type DomainPrice = {
    url: string;
    price: number;
}

export interface DomainRegistrar {
    properties: Registrar;

    getDomainPrice(
        browser: Browser,
        domainNameWithTLD: string,
        currency: string
    ): Promise<DomainPrice>;
}
