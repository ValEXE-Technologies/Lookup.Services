import * as puppeteer from 'puppeteer';

import {
    Registrar,
    WhoIsRegistrar,
    GoDaddyWhoIsRegisrar,
    DomainPrice,
    DomainRegistrar,
    GoDaddyDomainRegistrar
} from './';

const WHOIS_DOMAIN_REGISTRAR: WhoIsRegistrar = new GoDaddyWhoIsRegisrar();

const SUPPORTED_DOMAIN_REGISTRARS: { [key: string]: DomainRegistrar } = {
    ['godaddy']: new GoDaddyDomainRegistrar()
}

export class DomainServices {
    private domainRegistrars: Registrar[] = [];
    private browser: puppeteer.Browser = null;
    
    constructor(
        headLess: boolean = true
    ) {
        this.init(headLess)
            .then();
    }

    private async init(
        headLess: boolean = true
    ) {
        this.domainRegistrars = Object.keys(SUPPORTED_DOMAIN_REGISTRARS)
            .map((key) => SUPPORTED_DOMAIN_REGISTRARS[key].properties);
        this.browser = await puppeteer.launch({
            headless: headLess,
            defaultViewport: null
        });
    }

    public async isDomainAvailable(
        domainNameWithTLD: string
    ): Promise<boolean> {
        return await WHOIS_DOMAIN_REGISTRAR.isDomainAvailable(this.browser, domainNameWithTLD);
    }

    public async supportedDomains(): Promise<Registrar[]> {
        return this.domainRegistrars;
    }

    public async domainPrice(
        registrar: string,
        domainNameWithTLD: string,
        currency: string = 'USD'
    ): Promise<DomainPrice> {
        let domainRegistrar = SUPPORTED_DOMAIN_REGISTRARS[registrar.toLowerCase()];
        if (domainRegistrar !== undefined) {
            return await domainRegistrar.getDomainPrice(this.browser, domainNameWithTLD, currency);
        }

        return null;
    }
}
