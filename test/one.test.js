const { playwright,  expect, express, path } = require('./common');

const SERVER_PORT = 3753;
const TARGET_URL = `http://localhost:${SERVER_PORT}/index.html`;

let beforePromise, page;
describe('Test 1', () => {
    before(async () => {
        beforePromise = await Promise.all([
            playwright.chromium.launch({ headless: false })
                .then(browser => browser.newContext().then(context => ({ browser, context }))),
            new Promise(resolve => {
                const server = express();
                server.use('/', express.static(path.join(__dirname, 'assets')));
                const testServer = server.listen(SERVER_PORT, () => resolve(testServer));
            })
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


    it('Should Daje!', async () => {
        expect(await (await page.$('title')).innerText()).to.eq('Test page');
        expect(await (await page.$('h1')).innerText()).to.eq('Test');
    });


    after(async () => {
        const { browser, server } = await beforePromise;
        await server.close();
        await browser.close();
    });

});