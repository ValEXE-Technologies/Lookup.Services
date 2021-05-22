import { Browser } from 'puppeteer';
import * as UserAgents from 'user-agents';

import {
    BaseDomainRegistrar,
    DomainRegistrar,
    Registrar,
    DomainPrice
} from '.';

export class BigRockDomainRegistrar extends BaseDomainRegistrar implements DomainRegistrar {
    public properties: Registrar = {
        name: 'BigRock',
        baseUrl: 'https://www.bigrock.in',
        features: [
            'Basic DNS',
            '2 Email Accounts',
            'Domain Forwarding',
            'URL Masking',
            'DNS Management',
            'Domain Theft Protection'
        ]
    };

    public async getDomainPrice(
        browser: Browser,
        domainNameWithTLD: string,
        currency: string): Promise<DomainPrice> {
        
        let page = await browser.newPage();
        let url = `${this.properties.baseUrl}/domain-registration/index.php`;

        await page.setUserAgent(new UserAgents().toString());
        await page.goto(url, {
            waitUntil: 'networkidle2'
        });
        await page.waitForSelector('input[name=txtDomainName]');
        await page.type('input[name=txtDomainName]', domainNameWithTLD);
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        let innerHtml = await this.waitForSelectorAndGetInnerHtml(page, '#primarySearch > div:nth-child(3) > div > span.pricing-wrp > strong');
        page.close();
        
        if (null == innerHtml) {
            console.warn(`Failed to get Element for BigRock Price`);

            return null;
        }

        return {
            url: this.properties.baseUrl,
            price: this.extractPrice(innerHtml)
        };
    }
}
