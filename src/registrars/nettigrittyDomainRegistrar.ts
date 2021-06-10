import { Browser } from 'puppeteer';

import {
    BaseDomainRegistrar,
    DomainRegistrar,
    Registrar,
    DomainPrice
} from '.';

export class NettigrittyDomainRegistrar extends BaseDomainRegistrar implements DomainRegistrar {
    public properties: Registrar = {
        name: 'Nettigritty',
        baseUrl: 'https://www.nettigritty.com',
        currencyCodes: [
            "INR"
        ],
        features: [
            'Basic DNS'
        ]
    };

    public async getDomainPrice(
        browser: Browser,
        domainNameWithTLD: string,
        _: string): Promise<DomainPrice> {
        
        let page = await browser.newPage();
        let url = `${this.properties.baseUrl}`;

        await this.setupUserAgent(page);
        await page.goto(url, {
            waitUntil: 'networkidle2'
        });

        await page.waitForSelector('div > input#myInput');
        await page.type('div > input#myInput', domainNameWithTLD);
        await page.keyboard.press('Enter');
        // Since Nettiritty navigates to multiple pages
        // - has a 'loading' page before navigating to main pricing page
        await page.waitForTimeout(2000);
        await page.waitForNavigation({
            waitUntil: 'networkidle2'
        });

        let innerHtml = await this.waitForSelectorAndGetInnerHtml(page, '.dca-available > div > .dca-domain-avail:not(.dca-hide-disabled) > span > span.dca-pricing');
        await page.close();
        
        if (null == innerHtml) {
            console.warn(`Failed to get Element for ${this.properties.name} Price`);

            return null;
        }

        return {
            url: this.properties.baseUrl,
            price: this.extractPrice(innerHtml)
        };
    }
}
