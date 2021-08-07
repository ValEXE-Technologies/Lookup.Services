import { Browser, Page } from 'puppeteer';

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
        currencyCodes: [
            "INR",
            "USD"
        ],
        features: [
            'Basic DNS'
        ]
    };

    public async getDomainPrice(
        browser: Browser,
        domainNameWithTLD: string,
        currency: string): Promise<DomainPrice> {
        
        const selector = 'div:nth-child(1) > div > div > div.text-sm-center.mt-1 > span:nth-child(1) > div > span.text-nowrap > span.main-price';
        let page = await browser.newPage();
        let url = `${this.properties.baseUrl}/domainsearch/find?checkAvail=1&domainToCheck=${domainNameWithTLD}`;

        await this.setupUserAgent(page);
        await page.goto(this.properties.baseUrl, {
            waitUntil: 'networkidle2'
        });
        await this.changeCurrency(page, currency);

        await page.goto(url, {
            waitUntil: 'networkidle2'
        });

        let innerHtml = await this.waitForSelectorAndGetInnerHtml(page, selector);
        await page.close();
        
        if (null == innerHtml) {
            console.warn(`Failed to get Element for ${this.properties.name} Price`);

            return null;
        }

        return {
            url: url,
            price: this.extractPrice(innerHtml)
        };
    }

    private async changeCurrency(
        page: Page,
        currency: string
    ): Promise<void> {
        let innerHtml = await page.$eval('a > #currentCurrency', (el) => el.innerHTML);
        if (null == innerHtml) {
            return;
        }

        innerHtml = innerHtml.trim().toUpperCase();
        currency = currency.toUpperCase();
        if (innerHtml.includes(currency)) {
            return;
        }

        await page.evaluate((currency) => {
            document
                .querySelector<HTMLButtonElement>(`button[data-currencyid='${currency}']`)
                .click();
        }, currency);
    }
}
