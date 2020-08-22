import { ParamsType, LocationInfo } from "../types/params.type";
import HashagnaUtils from './hashagna-utils.class';
import HashagnaSerializator from "./hashagna-serializator.class";
import { HashagnaOptions } from "../interfaces/options.interface";

export default class HashagnaHttpClient {
    public static async get(url: string, queryParams: ParamsType, options?: HashagnaOptions): Promise<LocationInfo> {
        const iFrame = await HashagnaUtils.newIframe();
        const hashListener = HashagnaUtils.iframeListenerInjector(iFrame).finally(() => iFrame.remove());
        iFrame.src = `${url}?${HashagnaSerializator.serializeParams(queryParams)}`;
        return await hashListener;
    }

    public static async post(url: string, params: ParamsType, options?: HashagnaOptions): Promise<LocationInfo> {
        const iFrame = await HashagnaUtils.newIframe();
        const hashListener = HashagnaUtils.iframeListenerInjector(iFrame).finally(() => iFrame.remove());
        await HashagnaUtils.iFrameFormSubmit(iFrame, url, params);
        return await hashListener;
    }
}
