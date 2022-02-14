import * as zlib from "zlib";
import {IncorrectConverterDataVersion, NotSupportedConverterVersion} from "../models/Errors";

type ConverterType = {
    decode: {
        [key: number]: (str: string) => any
        latest: (str: string) => any
    },
    encode: {
        [key: number]: (obj: any) => string
        latest: (obj: any) => string
    }
}

const Converter: ConverterType = {
    decode: {
        0: (str: string) => {
            // Version 0
            return JSON.parse(
                zlib.inflateSync(Buffer.from(str.slice(1), "base64"))
                    .toString("utf8"),
            );
        },
        latest: () => undefined
    },
    encode: {
        0: (obj: any) => {
            // Version 0
            return "0" + zlib.deflateSync(JSON.stringify(obj)).toString("base64");
        },
        latest: () => ""
    },
};
Converter.decode.latest = Converter.decode[0]
Converter.encode.latest = Converter.encode[0]

export class ConverterMapperService {
    /**
     * Converts any object to string
     */
    static toString<T>(obj: T, version?: number): string {
        return Converter.encode[version || "latest"](obj)
    }

    /**
     * Converts string to encoded object
     * @throws IncorrectConverterDataVersion
     * @throws NotSupportedConverterVersion
     */
    static parse<T>(str: string): T {
        const version = str.slice(0, 1)
        if (version !== "0") {
            throw new NotSupportedConverterVersion(version);
        }
        let obj
        try {
            obj = Converter.decode[version](str);
        } catch (e) {
            throw new IncorrectConverterDataVersion(str)
        }
        return obj
    }

}
