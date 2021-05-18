import * as puppeteer from 'puppeteer';
const UserAgents = require('user-agents');

export class DomainServices {
    public async isDomainAvailable(
        domainNameWithTLD: string
    ): Promise<boolean> {
        let browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null
        });
        let page = await browser.newPage();
        let url = `https://in.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${domainNameWithTLD}`;

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
            browser.close();
        }

        return returnValue;
    }
}
