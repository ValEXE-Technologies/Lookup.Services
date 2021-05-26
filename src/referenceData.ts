export type Currency = {
    code: string;
    symbol: string;
    name: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'United States of America' }
];
