import { Browser } from 'puppeteer';
import UserAgents from 'user-agents';

import { WhoIsRegistrar } from './';

export class GoDaddyWhoIsRegisrar implements WhoIsRegistrar {
    public name: string = 'GoDaddy';
    public baseUrl: string = 'https://in.godaddy.com';

    async isDomainAvailable(
        browser: Browser,
        domainNameWithTLD: string): Promise<boolean> {
            
        let page = await browser.newPage();
        let url = `${this.baseUrl}/domainsearch/find?checkAvail=1&domainToCheck=${domainNameWithTLD}`;

        await page.setUserAgent(new UserAgents().toString());
        await page.goto(url, {
            waitUntil: 'networkidle2'
        });

        // Default Domain is available
        let returnValue = true;

        try {
            await page.waitForSelector(
                'span[data-cy="availableCard-badge"]', {
                timeout: 5000
            });
        } catch (err) {
            //console.warn(err);

            // Didn't find price of the domain, this means Domain is NOT available
            returnValue = false;
        } finally {
            await page.close();
        }

        return returnValue;
    }
}
