import { ParamsType, LocationInfo } from "../types/params.type";
import HashagnaUtils from './hashagna-utils.class';
import HashagnaSerializator from "./hashagna-serializator.class";

export default class HashagnaHttpClient {
    public static async get(url: string, queryParams: ParamsType): Promise<LocationInfo> {
        const iFrame = await HashagnaUtils.newIframe();
        const hashListener = HashagnaUtils.iframeListenerInjector(iFrame);
        iFrame.src = `${url}?${HashagnaSerializator.serializeParams(queryParams)}`;
        return await hashListener;
    }

    /*
    public post(url: string, params: ParamsType): Promise<UrlObject> {

    }
    */
}
