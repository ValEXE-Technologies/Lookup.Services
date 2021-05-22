import { Browser } from 'puppeteer';
import * as UserAgents from 'user-agents';

import {
    BaseDomainRegistrar,
    DomainRegistrar,
    Registrar,
    DomainPrice
} from '.';

export class GoDaddyDomainRegistrar extends BaseDomainRegistrar implements DomainRegistrar {
    public properties: Registrar = {
        name: 'GoDaddy',
        baseUrl: 'https://in.godaddy.com',
        features: [
            'Basic DNS'
        ]
    };

    public async getDomainPrice(
        browser: Browser,
        domainNameWithTLD: string,
        currency: string): Promise<DomainPrice> {
        
        const selector = '#exact-match > div > div > div > div > div > div.mb-3 > span.d-inline';
        let page = await browser.newPage();
        let url = `${this.properties.baseUrl}/domainsearch/find?checkAvail=1&domainToCheck=${domainNameWithTLD}`;

        await page.setUserAgent(new UserAgents().toString());
        await page.goto(url, {
            waitUntil: 'networkidle2'
        });

        let innerHtml = await this.waitForSelectorAndGetInnerHtml(page, selector);
        page.close();
        
        if (null == innerHtml) {
            console.warn(`Failed to get Element for GoDaddy Price`);

            return null;
        }

        return {
            url: url,
            price: this.extractPrice(innerHtml)
        };
    }
}
