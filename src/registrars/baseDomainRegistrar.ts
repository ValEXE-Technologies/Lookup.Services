import { ElementHandle, Page } from 'puppeteer';

export class BaseDomainRegistrar {
    private NUMERIC_REGEXP = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;

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

    extractPrice(
        innerHtml: string
    ): number {
        let matchArray = innerHtml.match(this.NUMERIC_REGEXP);

        return +matchArray;
    }
}
