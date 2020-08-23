import { playwright,  expect, cryptoMd5 } from './commons/common';
import redirectSimulator from './commons/302-simulator';
import * as http from 'http';
const { chromium, webkit, firefox } = playwright;

const SERVER_PORT = 3753;
const TARGET_URL = `http://localhost:${SERVER_PORT}`;
Object.entries({chromium, webkit, firefox}).forEach(([browserName, pwBrowserConnector]) => {

    describe(browserName, () => {
        let beforePromise: {browser: playwright.WebKitBrowser, context: playwright.BrowserContext, server: http.Server};
        before(async () => {
            beforePromise = await Promise.all([
                pwBrowserConnector.launch({ headless: false })
                    .then(browser => browser.newContext().then(context => ({ browser, context }))),
                new Promise<http.Server>(resolve => redirectSimulator(SERVER_PORT, resolve))
            ]).then(([pw, server]) => ({
                ...pw,
                server
            }));
        });
    
        describe('Simple', async () => {
            let page: playwright.Page;
            beforeEach(async () => {
                const { context } = beforePromise;
                page = await context.newPage();
                await page.goto(`${TARGET_URL}/simple-iife.html`);
            });
            afterEach(async () => {
                await page.close();
            });
    
            describe('GET', async () => {
                const code = 'dfs768sdf';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result', (input: HTMLInputElement) => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should delete iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect((await page.$$('iframe')).length).to.eq(0);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-get');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq('error');
                });
            });
        
            describe('POST', async () => {
                const code = 't58794nv2';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should delete iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect((await page.$$('iframe')).length).to.eq(0);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-post');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq('error');
                });
            });
        });
    
        describe('Existing iframe', async () => {
            let page: playwright.Page;
            beforeEach(async () => {
                const { context } = beforePromise;
                page = await context.newPage();
                await page.goto(`${TARGET_URL}/existing-iframe-iife.html`);
            });
            afterEach(async () => {
                await page.close();
            });
    
            describe('GET', async () => {
                const code = 'dfs768sdf';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should not delete the existing iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    await page.$('#result');
                    expect((await page.$$('iframe')).length).to.eq(1);
                    expect(await page.$eval('iframe', iframe => iframe.id)).to.eq('existing-iframe');
                    expect(await page.$eval('iframe', iframe => iframe.contentWindow && iframe.contentWindow.document.getElementsByClassName('text-success').length)).to.eq(1);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-get');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq('error');
                });
            });
    
            describe('POST', async () => {
                const code = 't58794nv2';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should not delete the existing iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect((await page.$$('iframe')).length).to.eq(1);
                    expect(await page.$eval('iframe', iframe => iframe.id)).to.eq('existing-iframe');
                    expect(await page.$eval('iframe', iframe => iframe.contentWindow && iframe.contentWindow.document.getElementsByClassName('text-success').length)).to.eq(1);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-post');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq('error');
                });
            });
        });
    

        describe('Module', async () => {
            let page: playwright.Page;
            beforeEach(async () => {
                const { context } = beforePromise;
                page = await context.newPage();
                await page.goto(`${TARGET_URL}/simple-mjs.html`);
            });
            afterEach(async () => {
                await page.close();
            });
    
            describe('GET', async () => {
                const code = 'dfs768sdf';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should delete iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect((await page.$$('iframe')).length).to.eq(0);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-get');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq('error');
                });
            });
        
            describe('POST', async () => {
                const code = 't58794nv2';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should delete iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect((await page.$$('iframe')).length).to.eq(0);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-post');
                    if (browserName === 'firefox') {
                        await new Promise(r => setTimeout(r, 500));
                    }
                    expect(await page.$eval('#result',  (input: HTMLInputElement) => input.value)).to.eq('error');
                });
            });
        });

        after(async () => {
            const { browser, server } = await beforePromise;
            await server.close();
            await browser.close();
        });
    
    });
});