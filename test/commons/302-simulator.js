const { express, path, cryptoMd5 } = require('./common');
const bodyParser = require('body-parser');

const assetsPath = path.join(__dirname, '../assets');
const DELAY = 300;
module.exports = (serverPort, callBack) => {
    const server = express();
    server.use('/', express.static(assetsPath));
    server.use('/dist', express.static(path.join(__dirname, '../../dist')));
    server.get('/api/redirection', (req, res) => res.sendStatus(200));
    server.get('/api/auto-redirect', (req, res) => {
        res.set('Cache-Control', 'no-store');
        setTimeout(() => {
            if (req.query.code) {
                res.redirect(302, `/redirection.html#result=${cryptoMd5(req.query.code)}`);
            } else {
                res.status(400).sendFile(path.join(assetsPath, 'error.html'));
            }
        }, DELAY);
    });
    server.post('/api/auto-redirect',  bodyParser.urlencoded({ extended: true }), (req, res) => {
        res.set('Cache-Control', 'no-store');
        setTimeout(() => {
            if (req.body.code) {
                res.redirect(302, `/redirection.html#result=${cryptoMd5(req.body.code)}`);
            } else {
                res.status(400).sendFile(path.join(assetsPath, 'error.html'));
            }
        }, DELAY);
    });
    const testServer = server.listen(serverPort, callBack ? () => callBack(testServer) : undefined);
    return testServer;
};
