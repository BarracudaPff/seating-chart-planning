import CustomError from "./CustomError";

export class NotSupportedConverterVersion extends CustomError {
    public constructor(version: string) {
        super("Converter version " + version + " is not supported")
    }
}

export class IncorrectConverterDataVersion extends CustomError {
    public constructor(data: string) {
        super("Converter data is incorrect or corrupted. \nData: `" + data + "`.")
    }
}
