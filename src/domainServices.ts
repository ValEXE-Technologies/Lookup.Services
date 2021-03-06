import puppeteer from 'puppeteer';

import {
    Registrar,
    WhoIsRegistrar,
    GoDaddyWhoIsRegisrar,
    DomainPrice,
    DomainRegistrar,
    GoDaddyDomainRegistrar,
    BigRockDomainRegistrar,
    NettigrittyDomainRegistrar,
    TwoGBHostingDomainRegistrar
} from './';

const WHOIS_DOMAIN_REGISTRAR: WhoIsRegistrar = new GoDaddyWhoIsRegisrar();

const SUPPORTED_DOMAIN_REGISTRARS: { [key: string]: DomainRegistrar } = {
    ['godaddy']: new GoDaddyDomainRegistrar(),
    ['bigrock']: new BigRockDomainRegistrar(),
    ['nettigritty']: new NettigrittyDomainRegistrar(),
    ['2gb hosting']: new TwoGBHostingDomainRegistrar()
}

export class DomainServices {
    private domainRegistrars: Registrar[] = [];
    private browser: puppeteer.Browser = null;
    
    constructor() {
    }

    public async init(
        headLess: boolean = true
    ) {
        this.domainRegistrars = Object.keys(SUPPORTED_DOMAIN_REGISTRARS)
            .map((key) => SUPPORTED_DOMAIN_REGISTRARS[key].properties);
        this.browser = await puppeteer.launch({
            headless: headLess
        });
    }

    public async isDomainAvailable(
        domainNameWithTLD: string
    ): Promise<boolean> {
        return await WHOIS_DOMAIN_REGISTRAR.isDomainAvailable(this.browser, domainNameWithTLD);
    }

    public async domainRegistrarsByCurrency(
        currencyCode: string
    ): Promise<Registrar[]> {
        return await this.domainRegistrars.filter((registrar) => registrar.currencyCodes.includes(currencyCode));
    }

    public async domainPrice(
        registrar: string,
        domainNameWithTLD: string,
        currency: string
    ): Promise<DomainPrice> {
        let domainRegistrar = SUPPORTED_DOMAIN_REGISTRARS[registrar.toLowerCase()];
        if (domainRegistrar !== undefined) {
            return await domainRegistrar.getDomainPrice(this.browser, domainNameWithTLD, currency);
        }

        return null;
    }
}
