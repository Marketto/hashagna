# hashagna
***The Final and definitive solution to handle 302+Location -> Hash pattern***

[![NPM Version](https://img.shields.io/npm/v/@marketto/hashagna.svg)](https://www.npmjs.com/package/@marketto/hashagna)
[![NPM Downloads](https://img.shields.io/npm/dm/@marketto/hashagna.svg)](https://www.npmjs.com/package/@marketto/hashagna)
[![Dependency status](https://david-dm.org/Marketto/hashagna.svg)](https://david-dm.org/Marketto/hashagna)
[![Dev dependency status](https://david-dm.org/Marketto/hashagna/dev-status.svg)](https://david-dm.org/Marketto/hashagna?type=dev)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=Marketto_hashagna&metric=alert_status)](https://sonarcloud.io/dashboard/index/Marketto_hashagna)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Marketto_hashagna&metric=coverage)](https://sonarcloud.io/dashboard/index/Marketto_hashagna)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=Marketto_hashagna&metric=sqale_rating)](https://sonarcloud.io/dashboard/index/Marketto_hashagna)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=Marketto_hashagna&metric=reliability_rating)](https://sonarcloud.io/dashboard/index/Marketto_hashagna)
![Build Status](http://ci.marketto.it/buildStatus/icon?job=hashagna)
[![LICENSE](https://img.shields.io/badge/licese-MIT-gold.svg)](https://github.com/Marketto/hashagna/blob/master/LICENSE)
[![Blog](https://img.shields.io/badge/blog-marketto-blue.svg)](http://blog.marketto.it)
[![Buy me a coffee](https://img.shields.io/badge/Ko--fi-donate-blueviolet)](https://ko-fi.com/marketto)

Utility to handle (GET or POST) APIs which redirects (3xx) to an uri appending Hash params via iFrame

## 🔌 INSTALLATION
```{r, engine='bash', global_install}
npm i -s @marketto/hashagna
```

## 🔧 USAGE
### MJS / ES6 / Typescript
```javascript
import { HashagnaHttpClient } from '@marketto/hashagna';
```

### AMD
```javascript
require(['/dist/hashagna.min.js'], ({ HashagnaHttpClient }) => {
    // your code
});
```

### Script
```html
<!-- Polyfills needed only to support IE11 -->
<script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=Object.entries%2CPromise%2CElement.prototype.remove"></script>
<script src="https://unpkg.com/@marketto/hashagna@latest/dist/hashagna.min.js"></script>
```

## 💻 DEMO
```{r, engine='bash', global_install}
npm run manual-test
```

## 📖 DOCUMENTATION
[JsDocs @ GitHub Pages](https://marketto.github.io/hashagna/)

### HashagnaHttpClient
*Class* with *static* methods
- Both get and post methods accepts 2 mandatory params and an optional 3rd one:
    * url - relative or absolute path of the api
    * params - (Object) Key/Value of params to be sent
    * options (optional)
        * iFrame - DOM Element to use
        * iFrameId - id of the iFrame to use
        * autoClean - (only with iFrame or iFrameId) if true the iframe will be wiped up after receiving data

- Both get and post methods are async and returns and object containing the following:
    * hash: string
    * hashParams: Object
    * host: string
    * hostname: string
    * href: string
    * origin: string
    * pathname: string
    * protocol: string
    * search: string
    * port: string
    * query: Object

#### GET
```javascript
HashagnaHttpClient.get('/api/auto-redirect', { code: '2345', userId: 'user id' })
        .then(({ hashParams }) => {
            console.log(hashParams); // {key: value, ...}
        })
        .catch(err => {
            // Handle your error
        });
```

#### POST
```javascript
HashagnaHttpClient.post('/another-api', { clientAuth: 'askjf' })
        .then(({ hashParams }) => { // {key: value, ...}
            console.log(hashParams.auth);
        })
        .catch(err => {
            // Handle your error
        });
```

## 🔃 Compatibility
* [X] Chromium 86.0.4217.0 (Chrome & Edge)
* [X] Firefox 80.0b8
* [X] Webkit 14 (Safari)
* [X] Internet Explorer 11.1016.18362.0


## 📜 LICENSE
[MIT License](LICENSE)

## 📝 AUTHOR
[Marco Ricupero](mailto:marco.ricupero@gmail.com)
