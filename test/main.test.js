const { playwright,  expect } = require('./commons/common');
const redirectSimulator = require('./commons/302-simulator');

const SERVER_PORT = 3753;
const TARGET_URL = `http://localhost:${SERVER_PORT}/index.html`;

let beforePromise, page;
describe('Test 1', () => {
    before(async () => {
        beforePromise = await Promise.all([
            playwright.chromium.launch({ headless: false })
                .then(browser => browser.newContext().then(context => ({ browser, context }))),
            new Promise(resolve => redirectSimulator(SERVER_PORT, resolve))
        ]).then(([pw, server]) => ({
            ...pw,
            server
        }));
    });

    beforeEach(async () => {
        const { context } = beforePromise;
        page = await context.newPage();
        await page.goto(TARGET_URL);
    });

    describe('GET', async () => {
        const code = 'dfs768sdf';
        it('Should retrieve sent code', async () => {
            await page.fill('#code', code);
            await page.click('#btn-get');
            expect(await page.$eval('#result', input => input.value)).to.eq(code);
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
            expect(await page.$eval('#result', input => input.value)).to.eq(code);
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

    after(async () => {
        const { browser, server } = await beforePromise;
        await server.close();
        await browser.close();
    });

});