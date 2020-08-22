import { ParamsType, LocationInfo } from "../types/params.type";
import HashagnaUtils from './hashagna-utils.class';
import HashagnaSerializator from "./hashagna-serializator.class";
import { HashagnaOptions } from "../interfaces/options.interface";

export default class HashagnaHttpClient {

    private static async initIFrame(options: HashagnaOptions = {}) {
        let iFrame: HTMLIFrameElement;

        if (options.iFrame instanceof HTMLIFrameElement) {
            iFrame = options.iFrame;
        } else if (options.iFrameId) {
            iFrame = await HashagnaUtils.isDomElementReady(() => document.getElementById(options.iFrameId as string) as HTMLIFrameElement)
        } else {
            iFrame = await HashagnaUtils.newIframe();
        }

        let finalCallback: () => void;
        if (!(options.iFrame || options.iFrameId)) {
            finalCallback = () => iFrame.remove();
        } else if (options.autoClean) {
            finalCallback = () => HashagnaUtils.isDomElementReady(() => iFrame.contentWindow &&
                iFrame.contentWindow.document.getElementsByTagName('body')[0] as HTMLBodyElement)
                    .then(iFrameBody => iFrameBody.innerHTML = '');
        } else {
            finalCallback = () => undefined;
        }

        const listener = HashagnaUtils.iframeListenerInjector(iFrame).finally(finalCallback);

        return {
            iFrame,
            listener
        };
    }

    public static async get(url: string, queryParams: ParamsType, options?: HashagnaOptions): Promise<LocationInfo> {
        const { iFrame, listener } = await this.initIFrame(options);
        iFrame.src = `${url}?${HashagnaSerializator.serializeParams(queryParams)}`;
        return await listener;
    }

    public static async post(url: string, params: ParamsType, options?: HashagnaOptions): Promise<LocationInfo> {
        const { iFrame, listener } = await this.initIFrame(options);
        await HashagnaUtils.iFrameFormSubmit(iFrame, url, params);
        return await listener;
    }
}
