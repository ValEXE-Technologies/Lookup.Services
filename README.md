## Lookup.Services

<img src="https://user-images.githubusercontent.com/75196744/123205334-512ea280-d4d7-11eb-9e27-6f974170bbc7.png" height="140" align="right">

[![npm @valexe-technologies/lookup.services package](https://img.shields.io/npm/v/@valexe-technologies/lookup.services)](https://www.npmjs.com/package/@valexe-technologies/lookup.services)
[![github @valexe-technologies/lookup.services issues](https://img.shields.io/github/issues/ValEXE-Technologies/Lookup.Services)](https://github.com/ValEXE-Technologies/Lookup.Services/issues)
[![github @valexe-technologies/lookup.services forks](https://img.shields.io/github/forks/ValEXE-Technologies/Lookup.Services)](https://github.com/ValEXE-Technologies/Lookup.Services/network/members)
[![github @valexe-technologies/lookup.services stargazers](https://img.shields.io/github/stars/ValEXE-Technologies/Lookup.Services)](https://github.com/ValEXE-Technologies/Lookup.Services/stargazers)
[![github @valexe-technologies/lookup.services license](https://img.shields.io/github/license/ValEXE-Technologies/Lookup.Services)](https://github.com/ValEXE-Technologies/Lookup.Services/LICENSE)

> Developes are welcome to extend support to integrate their preferred Domain Registrar

`Lookup.Services` is a [Node](https://nodejs.dev/) library which provides a high-level API to check the availability of the internet domain and price across supported registrars.

## Getting Started

### Installation

To use `Lookup.Services` in your project, run:

```bash
npm i @valexe-technologies/lookup.services
```

or

```bash
yarn add @valexe-technologies/lookup.services
```

Note: When you install `Lookup.Services`, it downloads a recent version of [Puppeteer](https://github.com/puppeteer/puppeteer) along with Chromium that is guaranteed to work with the API. To skip the download of Chromium, download into another path, or download a different browser, see [Puppeteer Environment variables](https://github.com/puppeteer/puppeteer/blob/v10.0.0/docs/api.md#environment-variables).

## Usage

`Lookup.Services` provides below listed APIs:

- List of supported `Currencies`
- List of supported `Registrars`
- Domain name is `Available` or not
- `Price` of the domain

### **Example -** Supported `Currencies`

Save file as **index.js**

```js
const lookupServices = require('@valexe-technologies/lookup.services');

(async () => {
    const supportedCurrencies = await lookupServices.SUPPORTED_CURRENCIES;

    console.log(supportedCurrencies);
})();
```

Execute script on the command line

```bash
node index.js
```

It will print list of supported `Currencies` as JSON object.

```json
[
  {
    "code": "INR",
    "symbol": "₹",
    "name": "Indian Rupee"
  },
  {
    "code": "USD",
    "symbol": "$",
    "name": "United States of America"
  }
]
```

### **Example -** Supported `Registrars`

Save file as **index.js**

```js
const lookupServices = require('@valexe-technologies/lookup.services');

(async () => {
    const domainServices = new lookupServices.DomainServices();
    await domainServices
        .init(
            false // headless 'false' to show Chromium instance
        );
    
    const supportedRegistrars = await domainServices
        .domainRegistrarsByCurrency(
            'INR' // one of the Supported "Currency Code"
        );

    console.log(supportedRegistrars);
})();
```

Execute script on the command line

```bash
node index.js
```

It will print list of supported `Registrars` as JSON object.

```json
[
  {
    "name": "GoDaddy",
    "baseUrl": "https://in.godaddy.com",
    "currencyCodes": [ "INR", "USD" ],  
    "features": [ "Basic DNS" ]
  },
  {
    "name": "BigRock",
    "baseUrl": "https://www.bigrock.in",
    "currencyCodes": [ "INR", "USD" ],
    "features": [
      "Basic DNS",
      "2 Email Accounts",
      "Domain Forwarding",
      "URL Masking",
      "DNS Management",
      "Domain Theft Protection"
    ]
  }
]
```

### **Example -** Is Domain `Available` or not

Save file as **index.js**

```js
const lookupServices = require('@valexe-technologies/lookup.services');

const domainTLD = 'com';
const randomDomainName = 'whatblarandomdomainxyz';
const exampleDomainNameWithTLD = `${randomDomainName}.${domainTLD}`;

(async () => {
    const domainServices = new lookupServices.DomainServices();
    await domainServices
        .init(
            false // headless 'false' to show Chromium instance
        );

    const response = await domainServices
        .isDomainAvailable(
            exampleDomainNameWithTLD
        );

    console.log(response);
})();
```

Execute script on the command line

```bash
node index.js
```

It will print `true` if domain is available or `false` if domain is not available.

```json
true or false
```

### **Example -** Domain `Price`

Save file as **index.js**

```js
const lookupServices = require('@valexe-technologies/lookup.services');

const domainTLD = 'com';
const randomDomainName = 'whatblarandomdomainxyz';
const exampleDomainNameWithTLD = `${randomDomainName}.${domainTLD}`;

(async () => {
    const domainServices = new lookupServices.DomainServices();
    await domainServices
        .init(
            false // headless 'false' to show Chromium instance
        );

    const response = await domainServices
        .domainPrice(
            'BigRock', // one of the "Registrar Name"
            exampleDomainNameWithTLD,
            'INR' // one of the Supported "Currency Code"
        );

    console.log(response);
})();
```

Execute script on the command line

```bash
node index.js
```

It will print `Registrar` URL and domain `Price` as JSON object.

```json
{
  "url": "https://www.bigrock.in",
  "price": 799
}
```
