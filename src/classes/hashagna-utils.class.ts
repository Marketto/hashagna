import { LocationInfo } from '../types/params.type';
import HashagnaSerializator from './hashagna-serializator.class';

export default class HashagnaUtils {
    public static async newIframe(): Promise<HTMLIFrameElement> {
        const id = this.newId();
        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'display: none');
        iframe.setAttribute('id', id);
        window.document.body.appendChild(iframe);
        return await this.getIframe(id)
    }

    private static async getIframe(id: string): Promise<HTMLIFrameElement> {
        const iFrame = document.getElementById(id) as HTMLIFrameElement;
        if (!iFrame) {
            return await new Promise(resolve => window.requestAnimationFrame(() => this.getIframe(id).then(resolve)));
        }
        return iFrame;
    }

    public static async iframeLoadedContentWindow(iFrame: HTMLIFrameElement): Promise<Window> {
        if (!iFrame.contentWindow) {
            return await new Promise(resolve => window.requestAnimationFrame(() => this.iframeLoadedContentWindow(iFrame).then(resolve)));
        }
        return iFrame.contentWindow;
    }

    public static iframeListenerInjector(iFrame: HTMLIFrameElement): Promise<LocationInfo> {
        return new Promise((resolve, reject) => {
            iFrame.onload = async () => {
                const contentWindow = await this.iframeLoadedContentWindow(iFrame);
                if (!contentWindow || !contentWindow.location || !contentWindow.location.hash) {
                    return reject(new Error('No hash params found'));
                }

                const { hash, host, hostname, href, origin, pathname, port, protocol, search } = contentWindow.location;

                return resolve({
                    hash,
                    hashParams: HashagnaSerializator.deserializeParams(hash),
                    host,
                    hostname,
                    href,
                    origin,
                    pathname,
                    protocol,
                    search,
                    port,
                    query: HashagnaSerializator.deserializeParams(search),
                });
            };
        });
    }

    private static newId(): string {
        return Math.random().toString(36).substring(2);
    }
}