import { LocationInfo, ParamsType } from '../types/params.type';
import HashagnaSerializator from './hashagna-serializator.class';

export default class HashagnaUtils {
    public static async newIframe(): Promise<HTMLIFrameElement> {
        const id = this.newId();
        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'display: none');
        iframe.setAttribute('id', id);
        window.document.body.appendChild(iframe);
        return await this.isDomElementReady(() => document.getElementById(id) as HTMLIFrameElement)
    }

    public static async isDomElementReady<T extends HTMLElement | Window | Document>(getter: () => T | null): Promise<T> {
        const target = getter();
        if (!target) {
            return await new Promise(resolve => window.requestAnimationFrame(() => this.isDomElementReady(getter).then(resolve)));
        }
        return target;
    }

    public static iframeListenerInjector(iFrame: HTMLIFrameElement): Promise<LocationInfo> {
        return new Promise((resolve, reject) => {
            iFrame.onload = async () => {
                const contentWindow = await this.isDomElementReady(() => iFrame.contentWindow);
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

    public static async iFrameFormSubmit(iFrame: HTMLIFrameElement, url: string, params: ParamsType) {
        // Retrieving iframe document
        const iFrameDoc = await this.isDomElementReady(() => iFrame.contentDocument);
        const iFrameDocElement =  await this.isDomElementReady(() => iFrameDoc.documentElement);

        // Cleaning up the iFrame document
        iFrameDocElement.innerHTML = '';
        // Creating form
        const consentForm = iFrameDoc.createElement('form');
        // Form id
        const id = this.newId();

        Object.entries({
            method: 'post',
            action: url,
            id,
        }).forEach(([key, value]) => consentForm.setAttribute(key, value));

        // Adding form input fields
        Object.entries(params).forEach(([name, value]) => {
            // Creating new input element
            const input = iFrameDoc.createElement('input');
            input.setAttribute('name', name);
            input.setAttribute('value', HashagnaSerializator.serializeValue(value));
            // Appending the input into the form
            consentForm.appendChild(input);
        });

        // Appending composed form into the iFrame
        iFrameDocElement.appendChild(consentForm);

        // Waiting for DOM to be ready
        await this.isDomElementReady(() => iFrameDoc.getElementById(id));
        // Sending request by form submit
        consentForm.submit();
    }
}