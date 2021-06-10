import { Page } from 'puppeteer';
import UserAgents from 'user-agents';

export class BaseDomainRegistrar {
    private NUMERIC_REGEX = /[-]{0,1}[\d]*[.]{0,1}[\d]+/;

    async setupUserAgent(
        page: Page
    ): Promise<void> {
        await page.setUserAgent(new UserAgents().toString());
    }

    async waitForSelectorAndGetInnerHtml(
        page: Page,
        selector: string,
        timeout: number = 5000
    ): Promise<string> {
        try {
            await page.waitForSelector( selector, { timeout: timeout });
            return await page.$eval(selector, (el) => el.innerHTML);
        } catch (err) {
            console.warn(`Failed to get Element for selector: ${selector}`);
            console.warn(err);
        }
        
        return null;
    }

    extractTLD(
        domainNameWithTLD: string
    ): string {
        let index = domainNameWithTLD.indexOf('.');
        if (index && index > 1) {
            return domainNameWithTLD.substr(index);
        }

        return null;
    }

    extractPrice(
        innerHtml: string
    ): number {
        innerHtml = innerHtml.replace(',', '');
        let matchArray = innerHtml.match(this.NUMERIC_REGEX);

        return +matchArray;
    }
}
