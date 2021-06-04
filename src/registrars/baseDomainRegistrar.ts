import { ElementHandle, Page } from 'puppeteer';

export class BaseDomainRegistrar {
    private NUMERIC_REGEX = /[-]{0,1}[\d]*[.]{0,1}[\d]+/;
    private TLD_REGEX = /\.[^.]{2,3}(?:\.[^.]{2,3})?$/;

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
        let matchArray = domainNameWithTLD.match(this.TLD_REGEX);
        if (matchArray && matchArray.length > 0) {
            return matchArray[0];
        }

        return null;
    }

    extractPrice(
        innerHtml: string
    ): number {
        let matchArray = innerHtml.match(this.NUMERIC_REGEX);

        return +matchArray;
    }
}
