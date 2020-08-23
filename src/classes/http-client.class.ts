import { ParamsType, LocationInfo } from "../types/params.type";
import HashagnaUtils from './utils.class';
import HashagnaSerializator from "./serializator.class";
import HashagnaOptions from "../interfaces/options.interface";

export default class HashagnaHttpClient {

    private static async getIFrame(iFrameId?: string): Promise<HTMLIFrameElement> {
        if (iFrameId) {
            return (await HashagnaUtils.isDomElementReady(() => document.getElementById(iFrameId))) as HTMLIFrameElement;
        }
        return await HashagnaUtils.newIframe();
    }

    private static async initIFrame(options?: HashagnaOptions) {
        const iFrame: HTMLIFrameElement = (options && options.iFrame) || await this.getIFrame(options ? options.iFrameId : undefined);

        const restoreDisabled = iFrame.hasAttribute('disabled');

        if (restoreDisabled) {
            iFrame.removeAttribute('disabled');
        }

        let finalCallback: () => void;
        if (!(options && (options.iFrame || options.iFrameId))) {
            finalCallback = () => iFrame.remove();
        } else if (options && options.autoClean) {
            finalCallback = () => {
                if (restoreDisabled) {
                    iFrame.setAttribute('disabled', '');
                }
                HashagnaUtils.isDomElementReady(() => iFrame.contentWindow &&
                iFrame.contentWindow.document.getElementsByTagName('body')[0] as HTMLBodyElement)
                    .then(iFrameBody => iFrameBody.innerHTML = '');
            }
        } else {
            finalCallback = () => {
                if (restoreDisabled) {
                    iFrame.setAttribute('disabled', '');
                }
            };
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
