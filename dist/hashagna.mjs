/**
 * @marketto/hashagna 1.0.0
 * Copyright (c) 2020, Marco Ricupero <marco.ricupero@gmail.com>
 * License: MIT
 */

class HashagnaSerializator {
    static deserializeParams(serializedParams) {
        return (serializedParams || '')
            .replace(/^(?:#|\?)/, '').split('&')
            .reduce((accumulator, keyValue) => {
            const [key, value] = keyValue.split('=');
            return {
                ...accumulator,
                [key.trim()]: this.deserializeValue(value),
            };
        }, {});
    }
    static deserializeValue(serializedValue) {
        const trimmedSerializedValue = (serializedValue || '').trim();
        if (trimmedSerializedValue === '') {
            return null;
        }
        if ((/^(?:true|false)$/i).test(trimmedSerializedValue)) {
            return (/^true$/i).test(trimmedSerializedValue);
        }
        if (trimmedSerializedValue === (parseFloat(trimmedSerializedValue)).toString()) {
            return parseFloat(trimmedSerializedValue);
        }
        return trimmedSerializedValue;
    }
    static serializeParams(deserializedParams) {
        return Object.entries(deserializedParams || {})
            .map(([key, value]) => `${key}=${this.serializeValue(value)}`)
            .join('&');
    }
    static serializeValue(deserializedValue) {
        if (deserializedValue === null || typeof deserializedValue === 'undefined') {
            return '';
        }
        if (['boolean', 'number', 'string'].includes(typeof deserializedValue)) {
            return (deserializedValue).toString();
        }
        return '';
    }
}

class HashagnaUtils {
    static async newIframe() {
        const id = this.newId();
        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'display: none');
        iframe.setAttribute('id', id);
        window.document.body.appendChild(iframe);
        return await this.isDomElementReady(() => document.getElementById(id));
    }
    /*
        private static async getIframe(id: string): Promise<HTMLIFrameElement> {
            const iFrame = document.getElementById(id) as HTMLIFrameElement;
            if (!iFrame) {
                return await new Promise(resolve => window.requestAnimationFrame(() => this.getIframe(id).then(resolve)));
            }
            return iFrame;
        }
    
        private static async iframeLoadedContentWindow(iFrame: HTMLIFrameElement): Promise<Window> {
            if (!iFrame.contentWindow) {
                return await new Promise(resolve => window.requestAnimationFrame(() => this.iframeLoadedContentWindow(iFrame).then(resolve)));
            }
            return iFrame.contentWindow;
        }
    */
    static async isDomElementReady(getter) {
        const target = getter();
        if (!target) {
            return await new Promise(resolve => window.requestAnimationFrame(() => this.isDomElementReady(getter).then(resolve)));
        }
        return target;
    }
    static iframeListenerInjector(iFrame) {
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
    static newId() {
        return Math.random().toString(36).substring(2);
    }
    static async iFrameFormSubmit(iFrame, url, params) {
        // Retrieving iframe document
        const iFrameDoc = await this.isDomElementReady(() => iFrame.contentDocument);
        const iFrameDocElement = await this.isDomElementReady(() => iFrameDoc.documentElement);
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

class HashagnaHttpClient {
    static async get(url, queryParams, options) {
        const iFrame = await HashagnaUtils.newIframe();
        const hashListener = HashagnaUtils.iframeListenerInjector(iFrame).finally(() => iFrame.remove());
        iFrame.src = `${url}?${HashagnaSerializator.serializeParams(queryParams)}`;
        return await hashListener;
    }
    static async post(url, params, options) {
        const iFrame = await HashagnaUtils.newIframe();
        const hashListener = HashagnaUtils.iframeListenerInjector(iFrame).finally(() => iFrame.remove());
        await HashagnaUtils.iFrameFormSubmit(iFrame, url, params);
        return await hashListener;
    }
}

export { HashagnaHttpClient, HashagnaUtils };
//# sourceMappingURL=hashagna.mjs.map
