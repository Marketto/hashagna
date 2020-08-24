type ParamValueType = string | number | boolean | Date | null;
type ParamsType = {
    [param: string]: ParamValueType;
};
type LocationInfo = {
    hash?: string | null;
    hashParams?: ParamsType | null;
    host?: string | null;
    hostname?: string | null;
    href?: string | null;
    origin?: string | null;
    pathname?: string | null;
    protocol?: string | null;
    search?: string | null;
    port?: string | null;
    query?: ParamsType | null;
};
declare class HashagnaUtils {
    static newIframe(): Promise<HTMLIFrameElement>;
    static isDomElementReady<T extends HTMLElement | Window | Document>(getter: () => T | null): Promise<T>;
    static iframeListenerInjector(iFrame: HTMLIFrameElement): Promise<LocationInfo>;
    private static newId;
    static iFrameFormSubmit(iFrame: HTMLIFrameElement, url: string, params: ParamsType): Promise<void>;
}
interface HashagnaOptions {
    iFrameId?: string;
    iFrame?: HTMLIFrameElement;
    autoClean?: boolean;
}
type HashagnaParams = HashagnaOptions;
declare class HashagnaHttpClient {
    private static getIFrame;
    private static initIFrame;
    static get(url: string, queryParams: ParamsType, options?: HashagnaOptions): Promise<LocationInfo>;
    static post(url: string, params: ParamsType, options?: HashagnaOptions): Promise<LocationInfo>;
}
export { HashagnaHttpClient as default, HashagnaHttpClient, HashagnaUtils, LocationInfo, ParamsType, ParamValueType, HashagnaParams };
