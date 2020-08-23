import { express, path, cryptoMd5} from './common';
import bodyParser from 'body-parser';
import * as http from "http";

const assetsPath = path.join(__dirname, '../assets');
const DELAY = 300;
export default (serverPort: number | string, callBack?: (server: http.Server) => void): http.Server => {
    const server = express();
    server.use('/', express.static(assetsPath));
    server.use('/src', express.static(path.join(__dirname, '../../src')));
    server.use('/dist', express.static(path.join(__dirname, '../../dist')));
    server.get('/api/redirection', (req, res) => res.sendStatus(200));
    server.get('/api/auto-redirect', (req, res) => {
        res.set('Cache-Control', 'no-store');
        setTimeout(() => {
            if (req.query.code && typeof req.query.code === 'string') {
                res.redirect(302, `/redirection.html#result=${cryptoMd5(req.query.code)}`);
            } else {
                res.status(400).sendFile(path.join(assetsPath, 'error.html'));
            }
        }, DELAY);
    });
    server.post('/api/auto-redirect',  bodyParser.urlencoded({ extended: true }), (req, res) => {
        res.set('Cache-Control', 'no-store');
        setTimeout(() => {
            if (req.body.code && typeof req.body.code === 'string') {
                res.redirect(302, `/redirection.html#result=${cryptoMd5(req.body.code)}`);
            } else {
                res.status(400).sendFile(path.join(assetsPath, 'error.html'));
            }
        }, DELAY);
    });
    const testServer: http.Server = server.listen(serverPort, callBack ? () => callBack(testServer) : undefined);
    return testServer;
};
