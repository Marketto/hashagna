const { playwright,  expect, cryptoMd5 } = require('./commons/common');
const {chromium, webkit, firefox} = playwright;
const redirectSimulator = require('./commons/302-simulator');

const SERVER_PORT = 3753;
const TARGET_URL = `http://localhost:${SERVER_PORT}`;
Object.entries({chromium, webkit, firefox}).forEach(([browserName, pwBrowserConnector]) => {

    describe(browserName, () => {
        let beforePromise;
        before(async () => {
            beforePromise = await Promise.all([
                pwBrowserConnector.launch({ headless: false })
                    .then(browser => browser.newContext().then(context => ({ browser, context }))),
                new Promise(resolve => redirectSimulator(SERVER_PORT, resolve))
            ]).then(([pw, server]) => ({
                ...pw,
                server
            }));
        });
    
        describe('Simple', async () => {
            let page;
            beforeEach(async () => {
                const { context } = beforePromise;
                page = await context.newPage();
                await page.goto(`${TARGET_URL}/simple.html`);
            });
            afterEach(async () => {
                await page.close();
            });
    
            describe('GET', async () => {
                const code = 'dfs768sdf';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    expect(await page.$eval('#result', input => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should delete iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    expect((await page.$$('iframe')).length).to.eq(0);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-get');
                    expect(await page.$eval('#result', input => input.value)).to.eq('error');
                });
            });
        
            describe('POST', async () => {
                const code = 't58794nv2';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    expect(await page.$eval('#result', input => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should delete iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    expect((await page.$$('iframe')).length).to.eq(0);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-post');
                    expect(await page.$eval('#result', input => input.value)).to.eq('error');
                });
            });
        });
    
        describe('Existing iframe', async () => {
            let page;
            beforeEach(async () => {
                const { context } = beforePromise;
                page = await context.newPage();
                await page.goto(`${TARGET_URL}/existing-iframe.html`);
            });
            afterEach(async () => {
                await page.close();
            });
    
            describe('GET', async () => {
                const code = 'dfs768sdf';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    expect(await page.$eval('#result', input => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should not delete the existing iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-get');
                    expect((await page.$$('iframe')).length).to.eq(1);
                    expect(await page.$eval('iframe', iframe => iframe.id)).to.eq('existing-iframe');
                    expect(await page.$eval('iframe', iframe => iframe.contentWindow.document.getElementsByClassName('text-success').length)).to.eq(1);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-get');
                    expect(await page.$eval('#result', input => input.value)).to.eq('error');
                });
            });
    
            describe('POST', async () => {
                const code = 't58794nv2';
                it('Should retrieve sent code', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    expect(await page.$eval('#result', input => input.value)).to.eq(cryptoMd5(code));
                });
                it('Should not delete the existing iframe', async () => {
                    await page.fill('#code', code);
                    await page.click('#btn-post');
                    expect((await page.$$('iframe')).length).to.eq(1);
                    expect(await page.$eval('iframe', iframe => iframe.id)).to.eq('existing-iframe');
                    expect(await page.$eval('iframe', iframe => iframe.contentWindow.document.getElementsByClassName('text-success').length)).to.eq(1);
                });
                it('Should manage error', async () => {
                    await page.click('#btn-post');
                    expect(await page.$eval('#result', input => input.value)).to.eq('error');
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