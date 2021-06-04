import { Browser, Page } from 'puppeteer';
import * as UserAgents from 'user-agents';

import {
    BaseDomainRegistrar,
    DomainRegistrar,
    Registrar,
    DomainPrice
} from '.';

type ResponseModel = {
    extension: string;
    firstprice: number;
}

export class TwoGBHostingDomainRegistrar extends BaseDomainRegistrar implements DomainRegistrar {
    public properties: Registrar = {
        name: '2GB Hosting',
        baseUrl: 'https://manage.2gbhosting.com',
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
        let url = `${this.properties.baseUrl}/domainprice.php`;
        let tld = this.extractTLD(domainNameWithTLD);

        await page.setUserAgent(new UserAgents().toString());
        await page.goto(url, {
            waitUntil: 'networkidle2'
        });

        await page.waitForSelector('form > div > div > input');
        await page.type('form > div > div > input', tld);

        let innerHtml = await this.waitForSelectorAndGetInnerHtml(page, 'table > tbody:nth-child(2) > tr > td:nth-child(2)');
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
