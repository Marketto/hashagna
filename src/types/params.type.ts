export type ParamValueType = string | number | boolean | Date | null;
export type ParamsType = { [param: string]: ParamValueType };
export  type LocationInfo = {
    hash?: string | null,
    hashParams?: ParamsType | null,
    host?: string | null,
    hostname?: string | null,
    href?: string | null,
    origin?: string | null,
    pathname?: string | null,
    protocol?: string | null,
    search?: string | null,
    port?: string | null,
    query?: ParamsType | null,
}