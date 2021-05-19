import * as puppeteer from 'puppeteer';
import * as UserAgents from 'user-agents';

import {
    Registrar
} from './models';

export class DomainServices {
    private browser: puppeteer.Browser = null;

    private readonly whoIsRegistrars: Registrar[] = [
        { name: 'GoDaddy', baseUrl: 'https://in.godaddy.com' }
    ]
    
    private readonly supportedRegistrars: Registrar[] = [
        { name: 'GoDaddy', baseUrl: 'https://in.godaddy.com' }
    ]
    
    constructor(
        headLess: boolean = true
    ) {
        this.init(headLess)
            .then();
    }

    private async init(
        headLess: boolean = true
    ) {
        this.browser = await puppeteer.launch({
            headless: headLess,
            defaultViewport: null
        });
    }

    public async isDomainAvailable(
        domainNameWithTLD: string
    ): Promise<boolean> {
        let page = await this.browser.newPage();
        let url = `${this.whoIsRegistrars[0].baseUrl}/domainsearch/find?checkAvail=1&domainToCheck=${domainNameWithTLD}`;

        await page.setUserAgent(new UserAgents().toString());
        await page.goto(url, {
            waitUntil: 'networkidle2'
        });

        // Default Domain is available
        let returnValue = true;

        try {
            await page.waitForSelector(
                '#exact-match > div > div > div > div > div > div.mb-3', {
                timeout: 5000
            });
        } catch (err) {
            //console.warn(err);

            // Didn't find price of the domain, this means Domain is NOT available
            returnValue = false;
        } finally {
            page.close();
        }

        return returnValue;
    }

    public async supportedDomains(): Promise<Registrar[]> {
        return this.supportedRegistrars;
    }
}
