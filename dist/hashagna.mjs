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
        return await this.getIframe(id);
    }
    static async getIframe(id) {
        const iFrame = document.getElementById(id);
        if (!iFrame) {
            return await new Promise(resolve => window.requestAnimationFrame(() => this.getIframe(id).then(resolve)));
        }
        return iFrame;
    }
    static async iframeLoadedContentWindow(iFrame) {
        if (!iFrame.contentWindow) {
            return await new Promise(resolve => window.requestAnimationFrame(() => this.iframeLoadedContentWindow(iFrame).then(resolve)));
        }
        return iFrame.contentWindow;
    }
    static iframeListenerInjector(iFrame) {
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
    static newId() {
        return Math.random().toString(36).substring(2);
    }
}

class HashagnaHttpClient {
    static async get(url, queryParams) {
        const iFrame = await HashagnaUtils.newIframe();
        const hashListener = HashagnaUtils.iframeListenerInjector(iFrame);
        iFrame.src = `${url}?${HashagnaSerializator.serializeParams(queryParams)}`;
        return await hashListener;
    }
}

export { HashagnaHttpClient, HashagnaUtils };
//# sourceMappingURL=hashagna.mjs.map
