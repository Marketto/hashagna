import { ParamsType, ParamValueType } from '../types/params.type';

export default class HashagnaSerializator {
    public static deserializeParams(serializedParams?: string): ParamsType {
        return  (serializedParams || '')
            .replace(/^(?:#|\?)/, '').split('&')
            .reduce((accumulator: ParamsType, keyValue: string) => {
                const [key, value] = keyValue.split('=');
                return {
                    ...accumulator,
                    [key.trim()]: this.deserializeValue(value),
                };
            }, {});
    }

    public static deserializeValue(serializedValue?: string): ParamValueType {
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

    public static serializeParams(deserializedParams?: ParamsType): string {
        return Object.entries(deserializedParams || {})
            .map(([key, value]) => `${key}=${this.serializeValue(value)}`)
            .join('&');
    }

    public static serializeValue(deserializedValue?: ParamValueType): string {
        if (deserializedValue === null || typeof deserializedValue === 'undefined') {
            return '';
        }
        if (['boolean', 'number', 'string'].includes(typeof deserializedValue)) {
            return (deserializedValue).toString();
        }
        return '';
    }
}