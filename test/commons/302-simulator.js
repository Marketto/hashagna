const { express, path } = require('./common');

module.exports = (serverPort, callBack) => {
    const server = express();
    server.use('/', express.static(path.join(__dirname, '../assets')));
    server.use('/lib', express.static(path.join(__dirname, '../../dist')));
    server.get('/api/redirection', (req, res) => res.sendStatus(200));
    server.get('/api/auto-redirect', (req, res) => {
        setTimeout(() => {
            if (req.query.code) {
                res.redirect(302, `/redirection.html#result=${req.query.code}`);
            } else {
                res.sendStatus(400);
            }
        }, 600);
    });
    const testServer = server.listen(serverPort, callBack ? () => callBack(testServer) : undefined);
    return testServer;
};
